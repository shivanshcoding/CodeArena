'use client';

import ProfileDropdown from './ProfileDropdown';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left: Logo */}
      <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
        CodeArena
      </Link>

      {/* Center: Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link href="/problems" className="hover:text-gray-300">Problems</Link>
        <Link href="/contest" className="hover:text-gray-300">Contests</Link>
        <Link href="/explore" className="hover:text-gray-300">Explore</Link>
        <Link href="/interview" className="hover:text-gray-300">Interview</Link>
      </div>

      {/* Right: Profile or Auth Buttons */}
      <div className="flex items-center space-x-4">
        {user ? (
          <ProfileDropdown />
        ) : (
          <>
            <Link href="/login" className="text-white hover:text-gray-300">Login</Link>
            <Link href="/register" className="text-white hover:text-gray-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
