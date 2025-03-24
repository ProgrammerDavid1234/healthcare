const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleStripeWebhook,
  getUserSubscription, // ✅ Ensure this function exists in your controller
} = require("../controllers/subscriptionController");

const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ Ensure correct import

// ✅ Correct way to define routes
router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
router.get("/user/subscription", authMiddleware, getUserSubscription); // ✅ Fix: Use "router.get"

// ✅ Export `router`, NOT `app.use()`
module.exports = router;
