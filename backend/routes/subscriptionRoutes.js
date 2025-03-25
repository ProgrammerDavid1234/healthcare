const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User"); // Adjust path based on your setup
const { protect } = require("../middleware/authMiddleware"); // Ensure this middleware sets req.user

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
      line_items: [{ price: priceIds[plan], quantity: 1 }], // ✅ Fixed
      success_url: `${process.env.FRONTEND_URL}/success`,
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

  // Handle subscription events
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
      user.subscriptionStatus = subscription.status;
      user.subscriptionPlan = Object.keys(priceIds).find(key => priceIds[key] === subscription.items.data[0].price.id); // ✅ Fixed
      await user.save();
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
      user.subscriptionStatus = "canceled";
      user.subscriptionPlan = "none";
      await user.save();
    }
  }

  res.sendStatus(200);
});

module.exports = router;
