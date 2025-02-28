const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorName: { type: String, required: true },  // ✅ Change doctorId to doctorName
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  symptoms: [{ type: String }],
}, { timestamps: true });

// ✅ Format date before sending response
appointmentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.date = obj.date.toISOString().split("T")[0]; // Removes time (T00:00:00.000Z)
  return obj;
};

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
