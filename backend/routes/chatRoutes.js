const express = require('express');
const { chatWithAI } = require('../controllers/chatController');
const router = express.Router();

// Chat with AI
router.post('/', chatWithAI);

module.exports = router;