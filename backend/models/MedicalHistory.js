const mongoose = require("mongoose");

const MedicalHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    condition: { type: String, required: true },
    medications: { type: [String], default: [] },
    doctorNotes: { type: String, default: "" }
});

module.exports = mongoose.model("MedicalHistory", MedicalHistorySchema);
