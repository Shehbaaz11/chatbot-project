const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Process a chat message and save to history if user is logged in
router.post('/process', chatController.processChat);

// Get chat history for a user
router.get('/history/:userId', chatController.getChatHistory);

// Save a message to chat history
router.post('/save', chatController.saveMessage);

// Delete chat history for a user
router.delete('/history/:userId', chatController.deleteChatHistory);

module.exports = router;
