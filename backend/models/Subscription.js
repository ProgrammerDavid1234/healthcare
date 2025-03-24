const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  priceId: { type: String, required: true },
  status: { type: String, enum: ["active", "canceled"], default: "active" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
