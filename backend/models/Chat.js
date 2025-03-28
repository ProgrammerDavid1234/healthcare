const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
