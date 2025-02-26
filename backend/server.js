const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");  // Axios for API calls

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/chatbotDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const ChatSchema = new mongoose.Schema({
    user: String,
    bot: String,
});
const Chat = mongoose.model("Chat", ChatSchema);

// Route to handle chat messages
app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await axios.post("http://127.0.0.1:5000/chat", { message });
        const botMessage = response.data.bot;

        // Save chat history to MongoDB
        const chatEntry = new Chat({ user: message, bot: botMessage });
        await chatEntry.save();

        res.json({ bot: botMessage });
    } catch (error) {
        res.status(500).json({ error: "Failed to communicate with chatbot API" });
    }
});

// Start Express Server
app.listen(3001, () => console.log("Server running on port 3001"));
