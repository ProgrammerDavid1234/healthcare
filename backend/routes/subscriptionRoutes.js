const express = require("express");
const router = express.Router();
const { createCheckoutSession, handleStripeWebhook } = require("../controllers/subscriptionController");

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
