"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
        { username, password },
        { withCredentials: true }
      );
      router.push("/dashboard"); // Navigate to dashboard after successful login
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-900 inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <h1 className="text-4xl font-extrabold mb-8">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border mb-4 p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border mb-8 p-2"
      />
      <button
        onClick={handleLogin}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Login
      </button>
      <p className="text-md m-3 max-w-2xl">
        Don&apos;t have an account?
        <Link href="/register">
          <span className="font-bold"> Register</span>
        </Link>
      </p>
    </div>
  );
}
