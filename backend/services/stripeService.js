const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-03-14", // Use the latest API version
});

module.exports = stripe;
