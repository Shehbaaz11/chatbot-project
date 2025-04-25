"use client";

import { useState, useEffect, memo, useRef } from "react";
import "../../styles/globals.css";
import { useRouter } from "next/navigation";

// Create a memoized message component to prevent re-renders
const ChatMessage = memo(({ message }) => {
  return (
    <div
      className={
        message.sender === "user"
          ? "message user-message"
          : "message bot-message"
      }
    >
      <p>{message.text}</p>
      {message.video_embed && (
        <div
          className="video-container"
          dangerouslySetInnerHTML={{ __html: message.video_embed }}
        />
      )}
    </div>
  );
});

const Chatbot = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  // Add a state to track if we're currently sending a message
  const [isSending, setIsSending] = useState(false);
  // Create a reference to the chat box for auto-scrolling
  const chatBoxRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);

    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setToken(storedToken);
      setUsername(storedUsername || 'User');

      // Fetch chat history if user is logged in
      fetchChatHistory(storedUserId, storedToken);
    }
  }, []);

  // Fetch chat history from the server
  const fetchChatHistory = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8282/api/chat/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending) return; // Prevent sending empty messages or during an active send

    // Set sending state to true to prevent multiple sends
    setIsSending(true);

    const userMessage = { sender: "user", text: input };
    // Create a new array instead of modifying the existing one
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Store the input value and clear the input field immediately
    const currentInput = input;
    setInput("");

    try {
      // If user is logged in, use the API endpoint that saves chat history
      const endpoint = userId
        ? `http://localhost:8282/api/chat/process`
        : "http://localhost:8282/chat";

      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if user is logged in
      if (userId && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: currentInput,
          userId: userId || null
        }),
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

      // Create a new array for the updated messages
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: "bot", text: "Error connecting to server." },
      ]);
    } finally {
      // Reset sending state
      setIsSending(false);
    }
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

  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');

    // Reset state
    setUserId(null);
    setToken(null);
    setUsername("");

    // Redirect to home page
    router.push('/');
  };

  // Clear chat history
  const clearChatHistory = () => {
    setMessages([]);

    // If user is logged in, delete chat history from server
    if (userId && token) {
      fetch(`http://localhost:8282/api/chat/history/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => console.error('Error clearing chat history:', error));
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isMounted) return null;

  return (
    <div className="chat-container">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ Open Chat History
      </button>

      {userId && (
        <>
          <div className="user-info">Logged in as: {username}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      )}

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <div>
            <button style={{marginRight: '10px', background: '#ff3860', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}} onClick={clearChatHistory}>Clear</button>
            <button className="close-sidebar" onClick={toggleSidebar}>
              ❌
            </button>
          </div>
        </div>
        <ul>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <li
                key={`sidebar-${index}`}
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
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <ChatMessage key={`chatbox-${index}`} message={msg} />
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              // Use a separate function to prevent re-renders of the entire component
              const newValue = e.target.value;
              setInput(newValue);
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a medical question..."
          />
          <button className="mic-btn" onClick={startSpeechRecognition}>
            🎤
          </button>
          <button className="send-btn" onClick={sendMessage} disabled={isSending}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
