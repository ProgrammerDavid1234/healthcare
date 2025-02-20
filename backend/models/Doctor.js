const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    ratings: { type: Number, default: 4.5 },  // Default rating
    consultationFee: { type: Number, default: 50 },  // Default fee
    location: { type: String, },
    availability: { type: Boolean, default: true }  // Availability status
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
