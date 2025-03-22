const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: { type: String },
  dateOfBirth: { type: Date }, // New field
  address: { type: String }, // New field
  bloodType: { type: String }, // New field
  allergies: [{ type: String }], // New field
  currentMedication: [{ type: String }], // New field
  emergencyContact: { type: String }, // New field
  medicalHistory: [{ type: String }],
  prescriptions: [{ type: String }],
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  subscription: {
    status: { type: String, default: "inactive" }, // active, inactive, canceled
    plan: { type: String, default: "" }, // Basic, Pro, Enterprise
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
},
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);