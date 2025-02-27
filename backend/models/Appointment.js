const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  symptoms: { type: [String] } // ✅ Change this from String to an Array of Strings
});

module.exports = mongoose.model('Appointment', appointmentSchema);
