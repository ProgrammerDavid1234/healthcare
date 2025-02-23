const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Patient or Doctor
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false }, // Track if the notification is read
        type: { type: String, enum: ["Appointment", "Reminder", "Medical Update"], required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
