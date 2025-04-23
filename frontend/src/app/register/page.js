"use client";
import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from 'axios';

function page() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const toggleVisibility = () => {
    setVisible(!visible);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const newUser = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password
      }

      console.log('Sending registration request to:', 'http://127.0.0.1:8282/users/register');
      const response = await axios.post("http://127.0.0.1:8282/users/register", newUser);

      if(response.status === 201){
        const data = response.data;
        console.log('Registration successful:', data.message);

        // Save user data to localStorage
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('token', data.token);

        // Redirect to chat page
        router.push('/chat');
      }
    }
    catch(err){
      console.error("Registration error:", err);

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);

        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.errors && err.response.data.errors.length > 0) {
          setError(err.response.data.errors[0].msg);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Request:", err.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError('An error occurred. Please try again.');
      }
    }
  }
  return (
    <div style={{backgroundColor: "#121212", color:"#e5e9f0"}} className="flex justify-center items-center h-screen w-screen">
      <div style={{backgroundColor: "#1e1e2e"}} className="flex h-2/3 w-2/3">
        <div className="w-1/2 flex flex-col items-center justify-center">
          <h1 style={{color:"#88c0d0"}} className="text-3xl font-bold pb-8">Create an account</h1>
          <form onSubmit={handleSubmit} className="flex items-center flex-col gap-5">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-80" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h2 className="text-sm ml-4">Enter your username</h2>
              <input required value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="px-6 py-3 rounded-3xl text-gray-900 min-w-80" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-sm ml-4">Enter your email</h2>
              <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="px-6 py-3 rounded-3xl text-gray-900 min-w-80" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-sm ml-4">Enter your password</h2>
              <input required value={password} onChange={(e) => setPassword(e.target.value)} type ={visible ? "text" : "password"} placeholder="Password" className="px-6 py-3 rounded-3xl text-gray-900 min-w-80" />
              {visible ?
                <EyeOffIcon onClick={() => toggleVisibility()} className="absolute mt-10 ml-72 pr-1 text-black hover:cursor-pointer"/>
                : <EyeIcon onClick={() => toggleVisibility()} className="absolute mt-10 ml-72 pr-1 text-black hover:cursor-pointer"/>
            }
            </div>
            <button type="submit" style={{backgroundColor: "#88c0d0"}} className=" px-3 py-2 rounded-3xl text-black font-semibold">Create Account</button>
            <h2>Already registered? <a style={{color:"#88c0d0"}} href="/login">Log In</a></h2>
          </form>
        </div>
        <div style={{overflow:"hidden", width:"40%"}} className=" ml-12 mt-8 mb-8 rounded-2xl">
            <img style={{width:"100%"}} src="./register.jpg" alt="The background image" />
        </div>
      </div>
    </div>
  );
}

export default page;
