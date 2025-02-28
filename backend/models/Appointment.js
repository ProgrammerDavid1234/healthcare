const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  symptoms: [{ type: String }],  // 👈 Make symptoms an array
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

// ✅ Fix: Export the model
module.exports = Appointment;
