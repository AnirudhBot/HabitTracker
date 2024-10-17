"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/register`,
        { username, password }
      );
      router.push("/login"); // Redirect to login after successful registration
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("Username already taken");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-900 inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <h1 className="text-4xl font-extrabold mb-8">Register</h1>
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
        onClick={handleRegister}
        className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
      >
        Register
      </button>
      <p className="text-md m-3 max-w-2xl">
        Already have an account?
        <Link href="/login">
          <span className="font-bold"> Login</span>
        </Link>
      </p>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
