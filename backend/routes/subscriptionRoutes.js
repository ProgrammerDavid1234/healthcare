const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Import subscriptionController functions correctly
const { createSubscription, handleStripeWebhook, getUserSubscription } = require("../controllers/subscriptionController");

// Define routes
router.post("/subscribe", createSubscription);
router.post("/webhook", handleStripeWebhook);
router.get("/user/subscription", protect, getUserSubscription);

router.post("/create", async (req, res) => {
    const { userId, plan } = req.body;

    if (!priceIds[plan]) {
        return res.status(400).json({ error: "Invalid subscription plan" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer: customer.id,
            line_items: [{ price: priceIds[plan], quantity: 1 }],
            success_url: `${process.env.FRONTEND_URL}/subscription-success`,
            cancel_url: `${process.env.FRONTEND_URL}/subscription-cancel`,
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/status", async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.subscription.status = "active";
    await user.save();

    res.json({ message: "Subscription updated" });
});


module.exports = router;
