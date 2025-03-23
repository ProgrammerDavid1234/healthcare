const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User"); // Ensure correct import

const createCheckoutSession = async (req, res) => {
  try {
    const { userId, priceId } = req.body;

    // Validate input
    if (!userId || !priceId) {
      return res.status(400).json({ error: "User ID and Price ID are required" });
    }

    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email, // Ensure your user model has an email field
      line_items: [
        {
          price: priceId, // Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: userId, // Pass user ID for later reference
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        // Find user by client_reference_id
        const user = await User.findById(session.client_reference_id);
        if (user) {
          user.subscription = {
            status: "active",
            stripeSubscriptionId: session.subscription,
            plan: session.items?.data[0]?.price.id || "unknown",
          };
          await user.save();
        }
        break;

      case "customer.subscription.deleted":
        const subscription = event.data.object;
        const unsubscribedUser = await User.findOne({ "subscription.stripeSubscriptionId": subscription.id });

        if (unsubscribedUser) {
          unsubscribedUser.subscription.status = "canceled";
          await unsubscribedUser.save();
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export both functions properly
module.exports = { createCheckoutSession, handleStripeWebhook };
