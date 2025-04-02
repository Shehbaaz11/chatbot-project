"use client";

import { useState, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Update chat history

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      // Support video embeds
      const botMessage = {
        sender: "bot",
        text: data.bot,
        video_embed: data.video_embed || null, // Include video if available
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]); // Update chat history
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Error connecting to server." },
      ]);
    }

    setInput(""); // Clear input field after sending
  };

  const startSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Your browser does not support Speech Recognition. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };

    recognition.start();
  };

  if (!isMounted) return null;

  return (
    <div className="chat-container">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ Open Chat History
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ❌
          </button>
        </div>
        <ul>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <li
                key={index}
                style={{ textAlign: msg.sender === "user" ? "right" : "left" }}
              >
                <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
                {msg.text}
              </li>
            ))
          ) : (
            <li>No chat history yet.</li>
          )}
        </ul>
      </div>

      <div className="chat-content">
        <div className="chat-header">Medexa</div>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "message user-message"
                  : "message bot-message"
              }
            >
              <p>{msg.text}</p>
              {msg.video_embed && (
                <div
                  className="video-container"
                  dangerouslySetInnerHTML={{ __html: msg.video_embed }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a medical question..."
          />
          <button className="mic-btn" onClick={startSpeechRecognition}>
            🎤
          </button>
          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
