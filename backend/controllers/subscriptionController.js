const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");

const subscribeUser = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan) return res.status(400).json({ error: "Plan is required" });

    // Define your Stripe price IDs
    const priceIdMap = {
      basic: "price_1R5X3HF26ipRoVZ5rVQ4EvMX",
      pro: "price_1R5X41F26ipRoVZ56mNoiC9x",
      enterprise: "price_1R5X4dF26ipRoVZ5EkMkWLf1",
    };

    const priceId = priceIdMap[plan];
    if (!priceId) return res.status(400).json({ error: "Invalid plan" });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://yourfrontend.com/success",
      cancel_url: "https://yourfrontend.com/cancel",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Subscription Error:", error);
    res.status(500).json({ error: "Subscription failed" });
  }
};

module.exports = { subscribeUser };
