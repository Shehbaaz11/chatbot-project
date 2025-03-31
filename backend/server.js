const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Axios for API calls
const connectToDB = require("./db/db");
const userRoutes = require('./routes/user.routes');
connectToDB();
const app = express();
app.use(express.json());
app.use(cors());


// Route to handle chat messages
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post("http://127.0.0.1:5000/chat", {
      message,
    });
    const botMessage = response.data.bot;


    res.json({ bot: botMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to communicate with chatbot API" });
  }
});

app.use('/users', userRoutes);


// Start Express Server
app.listen(8282, () => console.log("Server running on port 8282"));
