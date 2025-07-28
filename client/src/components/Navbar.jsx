'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import '@/styles/Navbar.css'; // ✅ Make sure this path is correct!
import { useState } from 'react';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link href="/" className="nav-logo">CodeArena</Link>
        <Link href="/problems" className="nav-link">Problems</Link>
        <Link href="/duels" className="nav-link">Duels</Link>
        <Link href="/contest" className="nav-link">Contests</Link>
        <Link href="/explore" className="nav-link">Explore</Link>
        <Link href="/interview" className="nav-link">Interview</Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden ml-2 p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col p-4 space-y-3">
          <Link href="/problems" className="nav-link block">Problems</Link>
          <Link href="/duels" className="nav-link block">Duels</Link>
          <Link href="/contest" className="nav-link block">Contests</Link>
          <Link href="/explore" className="nav-link block">Explore</Link>
          <Link href="/interview" className="nav-link block">Interview</Link>
        </div>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-profile">@{user.username}</span>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link href="/login" className="nav-btn">Login</Link>
            <Link href="/register" className="nav-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
