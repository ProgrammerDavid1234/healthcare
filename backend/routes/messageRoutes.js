const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getMessages,
  getConversations
} = require('../controllers/messageController');

router.post('/', protect, sendMessage);
router.get('/:receiverId', protect, getMessages);
router.get('/conversations/all', protect, getConversations); // ✅ Add this

module.exports = router;
