const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        enum: ['user', 'bot']
    },
    text: {
        type: String,
        required: true
    },
    video_embed: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
chatHistorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
