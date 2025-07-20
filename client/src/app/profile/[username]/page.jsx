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
        const res = await axios.get(`/profile/${username}`)
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
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <div className="flex gap-6 items-center">
        <img
          src={profile.photo || '/avatar.png'}
          alt="Avatar"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">@{profile.username}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-gray-700">
        <p><strong>Institute:</strong> {profile.institute || 'N/A'}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Age:</strong> {profile.age || 'N/A'}</p>
        <p>
          <strong>LinkedIn:</strong>{' '}
          {profile.linkedin ? (
            <a href={profile.linkedin} className="text-blue-600" target="_blank">
              {profile.linkedin}
            </a>
          ) : 'N/A'}
        </p>
        <p><strong>Joined:</strong> {new Date(profile.createdAt).toDateString()}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Your Stats</h3>
        <ul className="grid grid-cols-2 gap-4 text-center text-sm">
          <li className="bg-gray-100 p-4 rounded-lg">0 Submissions</li>
          <li className="bg-gray-100 p-4 rounded-lg">0 Points</li>
          <li className="bg-gray-100 p-4 rounded-lg">0 Duels</li>
          <li className="bg-gray-100 p-4 rounded-lg">0 Interviews</li>
        </ul>
      </div>
    </div>
  )
}
