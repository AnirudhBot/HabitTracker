'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AddHabit({ onAdd }: { onAdd: () => void }) {
  const [habit, setHabit] = useState('');
  const [error, setError] = useState('');

  const handleAddHabit = async () => {
    if (!habit) {
      setError('Habit cannot be empty');
      return;
    }

    try {
      await axios.post('/api/habits/add', { name: habit }, { withCredentials: true });
      setHabit('');
      onAdd(); // Refresh habit list
    } catch (err) {
      setError('Failed to add habit');
    }
  };

  return (
    <div className="my-4">
      <input
        type="text"
        placeholder="New Habit"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        className="border mb-2 p-2"
      />
      <button
        onClick={handleAddHabit}
        className="bg-green-500 text-white p-2 ml-2 rounded"
      >
        Add Habit
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
