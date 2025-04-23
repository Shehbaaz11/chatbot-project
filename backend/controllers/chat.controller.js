const ChatHistory = require('../models/chat.model');
const axios = require('axios');

// Save a message to chat history
exports.saveMessage = async (req, res) => {
    try {
        const { userId, message, sender } = req.body;
        
        if (!userId || !message || !sender) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find existing chat history for this user or create a new one
        let chatHistory = await ChatHistory.findOne({ userId });
        
        if (!chatHistory) {
            chatHistory = new ChatHistory({
                userId,
                messages: []
            });
        }

        // Add the new message
        chatHistory.messages.push({
            sender,
            text: message,
            video_embed: req.body.video_embed || null
        });

        await chatHistory.save();
        
        return res.status(200).json({ success: true, chatHistory });
    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ error: 'Failed to save message' });
    }
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const chatHistory = await ChatHistory.findOne({ userId });
        
        if (!chatHistory) {
            return res.status(200).json({ messages: [] });
        }

        return res.status(200).json({ messages: chatHistory.messages });
    } catch (error) {
        console.error('Error getting chat history:', error);
        return res.status(500).json({ error: 'Failed to get chat history' });
    }
};

// Process a chat message and save both user and bot messages
exports.processChat = async (req, res) => {
    try {
        const { userId, message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Save user message
        if (userId) {
            let chatHistory = await ChatHistory.findOne({ userId });
            
            if (!chatHistory) {
                chatHistory = new ChatHistory({
                    userId,
                    messages: []
                });
            }

            // Add user message
            chatHistory.messages.push({
                sender: 'user',
                text: message
            });

            await chatHistory.save();
        }

        // Send message to Flask API
        const response = await axios.post('http://127.0.0.1:5000/chat', {
            message
        });

        const botMessage = response.data.bot;
        const videoEmbed = response.data.video_embed;

        // Save bot response if user is logged in
        if (userId) {
            let chatHistory = await ChatHistory.findOne({ userId });
            
            // Add bot message
            chatHistory.messages.push({
                sender: 'bot',
                text: botMessage,
                video_embed: videoEmbed
            });

            await chatHistory.save();
        }

        // Return the bot response
        res.json({ 
            bot: botMessage,
            video_embed: videoEmbed
        });
    } catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

// Delete chat history for a user
exports.deleteChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await ChatHistory.findOneAndDelete({ userId });
        
        return res.status(200).json({ success: true, message: 'Chat history deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat history:', error);
        return res.status(500).json({ error: 'Failed to delete chat history' });
    }
};
