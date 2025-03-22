const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

router.post("/subscribe", subscriptionController.createSubscription);
router.post("/webhook", subscriptionController.handleStripeWebhook);

module.exports = router;
