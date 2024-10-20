"use client";

import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LandingPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-6xl font-extrabold mb-6">HabitTracker</h1>
          <p className="text-lg mb-8 max-w-2xl">
            HabitTracker is your personal assistant in building and maintaining
            good habits. Track your daily goals, connect with friends, and earn
            rewards for your achievements.
          </p>
          <div className="flex space-x-5">
            <Link href="/login">
              <div className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
                Login
              </div>
            </Link>
            <Link href="/register">
              <div className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200">
                Register
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
