"use client"
import { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]); // Update chat history

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }), // Corrected message variable
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.bot };

      setMessages([...messages, userMessage, botMessage]); // Update chat history
    } catch (error) {
      console.error("Error:", error);
      setMessages([...messages, { sender: "bot", text: "Error connecting to server." }]);
    }

    setInput(""); // Clear input field after sending
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>Chatbot</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        className="text-black"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter key press
        placeholder="Type a message..."
        style={{ width: "80%", padding: "5px", marginTop: "10px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "5px 10px" }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
