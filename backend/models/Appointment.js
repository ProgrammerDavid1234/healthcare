const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Patient
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
        date: { type: Date, required: true }, // Use Date type for better sorting
        time: { type: String, required: true }, // Time in string format
        symptoms: { type: String, required: true },
        status: { type: String, enum: ["Scheduled", "Completed", "Canceled"], default: "Scheduled" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);