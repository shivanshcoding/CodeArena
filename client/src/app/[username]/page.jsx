'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UserProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/profile/${username}`);
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError('User not found');
            }
        };
        if (username) fetchUser();
    }, [username]);

    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">Profile: @{user.username}</h1>
      <p className="text-gray-700 mb-1">Name: {user.name}</p>
      <p className="text-gray-700 mb-1">Email: {user.email}</p>
      <p className="text-gray-700 mb-1">Age: {user.age || 'N/A'}</p>
      <p className="text-gray-700 mb-1">Address: {user.address || 'N/A'}</p>
      <p className="text-sm text-gray-400 mt-4">Joined on {new Date(user.createdAt).toDateString()}</p>
    </div>
  );
}