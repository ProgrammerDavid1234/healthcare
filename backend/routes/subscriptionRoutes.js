const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User"); // Adjust path based on your setup
const { protect, restrictPremiumFeatures } = require("../middleware/authMiddleware");


// Define Stripe Price IDs
const priceIds = {
  basic: "price_1R5X3HF26ipRoVZ5rVQ4EvMX",
  pro: "price_1R5X41F26ipRoVZ56mNoiC9x",
  enterprise: "price_1R5X4dF26ipRoVZ5EkMkWLf1",
};

// Create a subscription checkout session
router.post("/subscribe", protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure valid plan
    if (!priceIds[plan]) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    // Create Stripe customer if not already set
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceIds[plan], quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // ✅ Redirect here
      cancel_url: `${process.env.FRONTEND_URL}/subscription`,
    });
    

    res.json({ checkoutUrl: session.url }); // ✅ Return checkout URL
  } catch (error) {
    console.error("Stripe Subscription Error:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Handle Stripe Webhook for Subscription Events
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerId = session.customer;

    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
      user.subscriptionStatus = "active";
      user.subscriptionPlan = session.metadata.plan;
      user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await user.save();

      console.log(`✅ Subscription activated for ${user.email}`);

      // Send real-time update to frontend
      res.json({ success: true, message: "Subscription activated", user });
    }
  }

  res.sendStatus(200);
});
router.get("/status", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionEndDate: user.subscriptionEndDate,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/premium-feature", protect, restrictPremiumFeatures, async (req, res) => {
  res.json({ message: "Welcome to the premium feature!" });
});
module.exports = router;
