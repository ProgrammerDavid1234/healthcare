const User = require("../models/User");
const stripe = require("../config/stripe");

exports.createSubscription = async (req, res) => {
    try {
        const { userId, priceId, planName } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Create Stripe customer if not exists
        let customer;
        if (!user.subscription.stripeCustomerId) {
            customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId },
            });
            user.subscription.stripeCustomerId = customer.id;
        } else {
            customer = await stripe.customers.retrieve(user.subscription.stripeCustomerId);
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
        });

        // Store subscription details in DB
        user.subscription.status = "pending";
        user.subscription.plan = planName;
        user.subscription.stripeSubscriptionId = subscription.id;
        await user.save();

        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.handleStripeWebhook = async (req, res) => {
    let event;
    const sig = req.headers["stripe-signature"];
    
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscriptionId = event.data.object.subscription;
        const user = await User.findOne({ "subscription.stripeSubscriptionId": subscriptionId });

        if (user) {
            user.subscription.status = "active";
            await user.save();
        }
    }

    res.json({ received: true });
};
