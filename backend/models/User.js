const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: { type: String },
  medicalHistory: [{ type: String }],
  prescriptions: [{ type: String }],
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
