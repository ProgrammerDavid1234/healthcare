const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
