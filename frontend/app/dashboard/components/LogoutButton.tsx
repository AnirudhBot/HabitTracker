"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Post request to logout
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 mt-4 rounded"
    >
      Logout
    </button>
  );
}
