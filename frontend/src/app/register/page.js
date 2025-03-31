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
  const toggleVisibility = () => {
    setVisible(!visible);
  }
  const handleSubmit  = async (e) => {
    e.preventDefault();

    try{
      const newUser = {
        username: username,
        email: email,
        password: password
      }

      const response = await axios.post("http://127.0.0.1:8282/users/register",newUser)

      if(response.status == 201){
        const data = response.data;
        router.push('/chat');
      }
    }
    catch(err){
      console.log(err);
    }
  }
  return (
    <div style={{backgroundColor: "#121212", color:"#e5e9f0"}} className="flex justify-center items-center h-screen w-screen">
      <div style={{backgroundColor: "#1e1e2e"}} className="flex h-2/3 w-2/3">
        <div className="w-1/2 flex flex-col items-center justify-center">
          <h1 style={{color:"#88c0d0"}} className="text-3xl font-bold pb-8">Create an account</h1>
          <form onSubmit={handleSubmit} className="flex items-center flex-col gap-5">
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
