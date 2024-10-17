"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "./components/LogoutButton";
import AddHabit from "./components/AddHabit";
import AddFriend from "./components/AddFriend";

interface Habit {
  id: string;
  name: string;
}

interface Friend {
    id: string;
    username: string;
  }

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState("");

  const fetchHabits = async () => {
    try {
      const response = await axios.get("/api/habits", {
        withCredentials: true,
      });
      setHabits(response.data.habits);
    } catch (error) {
      setError("Failed to fetch habits.");
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get("/api/friends", {
        withCredentials: true,
      });
      setFriends(response.data.friends);
    } catch (error) {
      setError("Failed to fetch friends.");
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchFriends();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-2xl mt-4">Your Habits</h2>
      <ul className="list-disc pl-5">
        {habits.map((habit) => (
          <li key={habit.id}>{habit.name}</li>
        ))}
      </ul>

      <AddHabit onAdd={fetchHabits} />

      <h2 className="text-2xl mt-4">Your Friends</h2>
      <ul className="list-disc pl-5">
        {friends.map((friend) => (
          <li key={friend.id}>{friend.username}</li>
        ))}
      </ul>

      <AddFriend onAdd={fetchFriends} />

      <LogoutButton />
    </div>
  );
}
