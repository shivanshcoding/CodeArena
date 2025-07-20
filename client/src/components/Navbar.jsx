'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import ProfileDropdown from './ProfileDropdown'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Left: Logo */}
      <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
        CodeArena
      </Link>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/problems" className="hover:text-gray-300">Problems</Link>
        <Link href="/contest" className="hover:text-gray-300">Contests</Link>
        <Link href="/explore" className="hover:text-gray-300">Explore</Link>
        <Link href="/interview" className="hover:text-gray-300">Interview</Link>
      </div>

      {/* Right: Auth Buttons or Avatar */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              href={`/profile/${user.username}`}
              className="text-sm hidden md:inline hover:text-gray-300 transition"
            >
              @{user.username}
            </Link>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link href="/login" className="text-white hover:text-gray-300">Login</Link>
            <Link href="/register" className="text-white hover:text-gray-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
