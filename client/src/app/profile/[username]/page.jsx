'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { username } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${username}`);
        setProfile(res.data)
      } catch (err) {
        console.error(err)
        router.push('/')
      }
    }

    if (username) fetchProfile()
  }, [username])

  if (!profile) return <div className="text-center mt-10">Loading profile...</div>

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 flex items-center justify-center">
      <div className="card max-w-3xl w-full p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={profile.photo || '/avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-primary shadow-lg object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-primary drop-shadow-lg">{profile.name}</h1>
            <p className="text-muted text-xl mt-1">@{profile.username}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-lg text-foreground">
          <p><strong className="text-primary">Institute:</strong> {profile.institute || 'N/A'}</p>
          <p><strong className="text-primary">Email:</strong> {profile.email}</p>
          <p><strong className="text-primary">Age:</strong> {profile.age || 'N/A'}</p>
          <p>
            <strong className="text-primary">LinkedIn:</strong>{' '}
            {profile.linkedin ? (
              <a href={profile.linkedin} className="text-accent hover:underline transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                {profile.linkedin}
              </a>
            ) : 'N/A'}
          </p>
          <p><strong className="text-primary">Joined:</strong> {new Date(profile.createdAt).toDateString()}</p>
        </div>

        <div className="mt-8">
          <h3 className="font-extrabold text-2xl text-primary drop-shadow-lg mb-4">Your Stats</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <li className="card p-6 transform hover:scale-105 transition-all duration-300">
              <p className="text-3xl font-bold text-accent">0</p>
              <p className="text-muted mt-2">Submissions</p>
            </li>
            <li className="card p-6 transform hover:scale-105 transition-all duration-300">
              <p className="text-3xl font-bold text-accent">0</p>
              <p className="text-muted mt-2">Points</p>
            </li>
            <li className="card p-6 transform hover:scale-105 transition-all duration-300">
              <p className="text-3xl font-bold text-accent">0</p>
              <p className="text-muted mt-2">Duels</p>
            </li>
            <li className="card p-6 transform hover:scale-105 transition-all duration-300">
              <p className="text-3xl font-bold text-accent">0</p>
              <p className="text-muted mt-2">Interviews</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
