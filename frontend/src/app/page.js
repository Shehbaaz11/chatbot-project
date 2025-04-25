"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("token");

    // Update state
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-5xl font-bold mb-4 text-blue-400">Welcome to Medexa</h1>
            <p className="text-xl mb-2">Your AI Medical Assistant</p>
            {isLoggedIn && (
              <p className="text-green-400">Hello, {username}!</p>
            )}
          </div>
          <div className="w-32 h-32 overflow-hidden">
            <img
              src="/logo.png"
              alt="Medexa Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="mt-8 bg-gray-700 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">About Medexa</h2>
          <p className="mb-4">
            Medexa is an advanced AI-powered medical assistant designed to provide information about medical devices and equipment.
            Our chatbot can answer questions, provide explanations, and show instructional videos to help you understand how various
            medical devices work.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoggedIn ? (
            <>
              <Link href="/chat" className="w-full">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <span>Start Chat</span>
                </button>
              </Link>

              <Link href="/profile" className="w-full">
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <span>My Profile</span>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/chat" className="w-full">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <span>Start Chat as Guest</span>
                </button>
              </Link>

              <Link href="/login" className="w-full">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <span>Login</span>
                </button>
              </Link>

              <Link href="/register" className="w-full">
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <span>Register</span>
                </button>
              </Link>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>AI-generated, for reference only</p>
        </div>
      </div>
    </div>
  );
}
