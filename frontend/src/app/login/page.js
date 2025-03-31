"use client";
import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon, EyeOffIcon } from "lucide-react";
function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  }
  const handleSubmit =(e) => {
    e.preventDefault();
  }
  return (
    <div style={{backgroundColor: "#121212", color:"#e5e9f0"}} className="flex justify-center items-center h-screen w-screen">
      <div style={{backgroundColor: "#1e1e2e"}} className="flex h-2/3 w-2/3">
      <div style={{overflow:"hidden", width:"40%"}} className=" ml-14 mt-8 mb-8 rounded-2xl">
            <img style={{width:"100%"}} src="./register.jpg" alt="The background image" />
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <h1 style={{color:"#88c0d0"}} className="text-3xl font-bold pb-8">Log into your account</h1>
          <form onSubmit={handleSubmit} className="flex items-center flex-col gap-5">
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
            <button type="submit" style={{backgroundColor: "#88c0d0"}} className=" px-10 py-2 rounded-3xl text-black font-semibold">Log In</button>
            <h2>Not registered? <a style={{color:"#88c0d0"}} href="/register">Register</a></h2>
          </form>
        </div>
      </div>
    </div>
  );
}

export default page;
