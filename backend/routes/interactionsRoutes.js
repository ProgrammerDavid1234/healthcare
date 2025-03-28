const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Review = require("../models/Review");

const router = express.Router();

/**
 * 📩 Send a message (Patient or Doctor)
 * POST /api/messages
 */
router.post("/messages", protect, async (req, res) => {
    try {
        const { receiver, content } = req.body;
        if (!receiver || !content) {
            return res.status(400).json({ message: "Receiver and content are required." });
        }

        const chatId = [req.user.id, receiver].sort().join("_"); // Generate unique chat ID

        const message = new Message({
            sender: req.user.id,
            receiver,
            chatId,
            content,
        });

        await message.save();
        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
});


/**
 * 📜 Get chat history between a patient and doctor
 * GET /api/messages/:chatId
 */
router.get("/messages/:chatId", protect, async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort("timestamp");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve messages", error: error.message });
    }
});

/*
 * ⭐ Leave a review for a doctor
 * POST /api/reviews
 */
router.post("/reviews", protect, async (req, res) => {
    try {
        const { doctor, rating, comment } = req.body;
        if (!doctor || !rating || !comment) {
            return res.status(400).json({ message: "Doctor, rating, and comment are required." });
        }

        const review = new Review({
            doctor,
            patient: req.user.id,
            rating,
            comment,
        });

        await review.save();
        res.status(201).json({ message: "Review submitted successfully", data: review });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit review", error: error.message });
    }
});

/**
 * 🏥 Get reviews for a specific doctor
 * GET /api/reviews/:doctorId
 */
router.get("/reviews/:doctorId", async (req, res) => {
    try {
        const reviews = await Review.find({ doctor: req.params.doctorId }).populate("patient", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve reviews", error: error.message });
    }
});

router.post("/start-chat", protect, async (req, res) => {
    const { userId, doctorName } = req.body;
    
    try {
      let chat = await Chat.findOne({ userId, doctorName });
  
      if (!chat) {
        chat = new Chat({ userId, doctorName, messages: [] });
        await chat.save();
      }
  
      res.status(200).json({ chatId: chat._id });
    } catch (error) {
      res.status(500).json({ message: "Error starting chat", error });
    }
  });
  
module.exports = router;
