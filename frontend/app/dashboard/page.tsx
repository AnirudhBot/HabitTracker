"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
// import LogoutButton from "./components/LogoutButton";
// import AddHabit from "./components/AddHabit";
// import AddFriend from "./components/AddFriend";

interface Habit {
  _id: string;
  title: string;
  frequency: string;
  trackedDates: Date[];
}

interface Friend {
  _id: string;
  username: string;
  coins: number;
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newHabit, setNewHabit] = useState({ title: "", frequency: "daily" });
  const [friendSearch, setFriendSearch] = useState("");
  const [friendSuggestions, setFriendSuggestions] = useState<Friend[]>([]);

  const router = useRouter();

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/habits/listHabits`,
        {
          withCredentials: true,
        }
      );
      setHabits(response.data.habits);
    } catch (error) {
      toast.error("Failed to fetch habits.");
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/listFriends`,
        {
          withCredentials: true,
        }
      );
      setFriends(response.data.friends);
    } catch (error) {
      toast.error("Failed to fetch friends.");
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchFriends();
  }, []);

  const handleAddHabit = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/habits/`,
        {
          title: newHabit.title,
          frequency: newHabit.frequency,
        },
        {
          withCredentials: true,
        }
      );
      setHabits([...habits, res.data.habit]);
      setNewHabit({ title: "", frequency: "daily" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleFriendSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFriendSearch(query);

    if (query.length > 2) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/search?query=${query}`,
          {
            withCredentials: true,
          }
        );
        setFriendSuggestions(res.data.users);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    } else {
      setFriendSuggestions([]);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/addFriend`,
        { friendId },
        { withCredentials: true }
      );
      const friendRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/listFriends`,
        {
          withCredentials: true,
        }
      );
      setFriends(friendRes.data.friends);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleTrackHabit = async (habitId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/habits/${habitId}/track`,
        {},
        { withCredentials: true }
      );
      const updatedHabits = habits.map((habit) =>
        habit._id === habitId
          ? { ...habit, trackedDates: [...habit.trackedDates, new Date()] }
          : habit
      );
      setHabits(updatedHabits);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="h-screen mx-auto p-8 inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <div className="flex items-center mb-5">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          className="ml-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Add Habit Section */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Add a Habit</h2>
        <input
          type="text"
          value={newHabit.title}
          onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
          placeholder="Habit title"
          className="border p-2 mr-4"
        />
        <select
          value={newHabit.frequency}
          onChange={(e) =>
            setNewHabit({ ...newHabit, frequency: e.target.value })
          }
          className="border p-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          onClick={handleAddHabit}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Habit
        </button>
      </div>

      {/* Add Friend Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add a Friend</h2>
        <input
          type="text"
          value={friendSearch}
          onChange={handleFriendSearch}
          placeholder="Search by username"
          className="border p-2"
        />
        {friendSuggestions.length > 0 && (
          <ul className="border p-1 mt-2">
            {friendSuggestions.map((friend) => (
              <li
                key={friend._id}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                {friend.username}
                <button
                  className="px-4 py-1 ml-5 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={() => handleAddFriend(friend._id)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* List of Habits */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Habits</h2>
        <ul>
          {habits.map((habit) => (
            <li key={habit._id} className="flex items-center mb-4">
              <div>
                {habit.title} ({habit.frequency})
              </div>
              <div>
                <button
                  onClick={() => handleTrackHabit(habit._id)}
                  className="bg-green-500 text-white px-4 py-2 ml-5 rounded hover:bg-green-700"
                >
                  Track Habit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* List of Friends */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend._id} className="mb-4">
              {friend.username} - {friend.coins} coins
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
