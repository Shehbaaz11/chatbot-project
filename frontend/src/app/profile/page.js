"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Initialize stats from localStorage or with default values
  const [stats, setStats] = useState(null);

  // Initialize or load user stats
  useEffect(() => {
    // Try to load stats from localStorage
    const savedStats = localStorage.getItem('userStats');

    if (savedStats) {
      // If stats exist in localStorage, use them
      setStats(JSON.parse(savedStats));
    } else {
      // Otherwise, create default stats and save to localStorage
      const defaultStats = {
        questionsAsked: 0, // Start with zero questions
        favoriteTopics: ["Stethoscope", "Pulse Oximeter", "Blood Pressure Monitor"],
        lastActive: new Date().toLocaleDateString(),
        accountCreated: new Date().toLocaleDateString(), // Today
        sessionLength: 0, // 0 minutes average
        lastSession: new Date().toLocaleDateString()
      };

      // Save to localStorage
      localStorage.setItem('userStats', JSON.stringify(defaultStats));
      setStats(defaultStats);
    }
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          router.push("/login");
          return;
        }

        // Fetch user profile from backend
        const response = await axios.get(`http://localhost:8282/users/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);

        // If we can't fetch from API, use localStorage data
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const userId = localStorage.getItem("userId");

        if (username && email && userId) {
          setUser({
            username,
            email,
            userId
          });
        } else {
          setError("Could not load profile. Please log in again.");
        }

        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">My Profile</h1>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Home
          </button>
        </div>

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold">{user.username ? user.username.charAt(0).toUpperCase() : "U"}</span>
                </div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="mt-4 w-full pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">User ID: {user.userId}</p>
                  <p className="text-sm text-gray-400">Account Created: {stats.accountCreated}</p>
                  <p className="text-sm text-gray-400">Last Active: {stats.lastActive}</p>
                </div>
              </div>
            </div>

            {/* Usage Statistics Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Questions Asked</p>
                  <p className="text-2xl font-bold">{stats.questionsAsked}</p>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-400">Average Session Length</p>
                  <p className="text-2xl font-bold">{stats.sessionLength} min</p>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-400">Last Session</p>
                  <p className="text-lg">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Favorite Topics Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Favorite Topics</h2>
              <ul className="space-y-2">
                {stats.favoriteTopics.map((topic, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Suggested Topics</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Blood Glucose Monitor</li>
                  <li>• ECG/EKG Machine</li>
                  <li>• Nebulizer</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.questionsAsked > 0 ? (
              // Show activity based on questions asked (max 3)
              [...Array(Math.min(stats.questionsAsked, 3))].map((_, index) => (
                <div key={index} className="flex items-start pb-4 border-b border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      Asked about {stats.favoriteTopics[index % stats.favoriteTopics.length]}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(Date.now() - (index + 1) * 86400000).toLocaleDateString()} at{" "}
                      {new Date(Date.now() - (index + 1) * 86400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No activity yet. Start chatting to see your activity here!</p>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                // Simulate incrementing the question count when going to chat
                if (stats) {
                  const updatedStats = {
                    ...stats,
                    questionsAsked: stats.questionsAsked + 1,
                    sessionLength: stats.sessionLength + 1, // Increment session length by 1 minute
                    lastActive: new Date().toLocaleDateString(),
                    lastSession: new Date().toLocaleDateString()
                  };
                  localStorage.setItem('userStats', JSON.stringify(updatedStats));
                }
                window.location.href = "/chat";
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300"
            >
              Go to Chat
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition duration-300"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                // Clear user data from localStorage
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                localStorage.removeItem("email");
                localStorage.removeItem("token");

                // Redirect to home page
                window.location.href = "/";
              }}
              className="w-full md:col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
