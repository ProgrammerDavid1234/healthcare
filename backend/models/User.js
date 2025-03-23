const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    bloodType: { type: String },
    allergies: [{ type: String }],
    currentMedication: [{ type: String }],
    emergencyContact: { type: String },
    medicalHistory: [{ type: String }],
    prescriptions: [{ type: String }],
    role: { type: String, enum: ["patient", "doctor"], default: "patient" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    subscription: {
      status: { type: String, enum: ["active", "canceled", "none"], default: "none" },
      plan: { type: String, enum: ["basic", "pro", "enterprise"], default: "basic" },
      stripeSubscriptionId: { type: String, default: null },
    },
    appointmentsCount: { type: Number, default: 0 },
    aiMessagesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
