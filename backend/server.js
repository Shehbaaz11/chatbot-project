const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Axios for API calls
const connectToDB = require("./db/db");
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');

// Connect to MongoDB
connectToDB();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Legacy route to handle chat messages (for backward compatibility)
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post("http://127.0.0.1:5000/chat", {
      message,
    });
    const botMessage = response.data.bot;
    const videoEmbed = response.data.video_embed;

    res.json({
      bot: botMessage,
      video_embed: videoEmbed
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to communicate with chatbot API" });
  }
});

// Routes
app.use('/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Start Express Server
app.listen(8282, () => console.log("Server running on port 8282"));
