'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AddFriend({ onAdd }: { onAdd: () => void }) {
  const [friendUsername, setFriendUsername] = useState('');
  const [error, setError] = useState('');

  const handleAddFriend = async () => {
    if (!friendUsername) {
      setError('Friend username cannot be empty');
      return;
    }

    try {
      await axios.post('/api/friends/add', { username: friendUsername }, { withCredentials: true });
      setFriendUsername('');
      onAdd(); // Refresh friends list
    } catch (err) {
      setError('Failed to add friend');
    }
  };

  return (
    <div className="my-4">
      <input
        type="text"
        placeholder="Friend's Username"
        value={friendUsername}
        onChange={(e) => setFriendUsername(e.target.value)}
        className="border mb-2 p-2"
      />
      <button
        onClick={handleAddFriend}
        className="bg-blue-500 text-white p-2 ml-2 rounded"
      >
        Add Friend
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
