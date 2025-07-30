'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

import { useState } from 'react';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-card-bg text-foreground p-4 shadow-card-shadow flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-primary text-2xl font-bold">CodeArena</Link>
        <Link href="/problems" className="text-muted hover:text-primary transition-colors duration-200">Problems</Link>
        <Link href="/duels" className="text-muted hover:text-primary transition-colors duration-200">Duels</Link>
        <Link href="/contest" className="text-muted hover:text-primary transition-colors duration-200">Contests</Link>
        <Link href="/explore" className="text-muted hover:text-primary transition-colors duration-200">Explore</Link>
        <Link href="/interview" className="text-muted hover:text-primary transition-colors duration-200">Interview</Link>
        
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
      <div className={`md:hidden absolute top-16 left-0 right-0 bg-card-bg shadow-card-shadow z-50 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col p-4 space-y-3">
          <Link href="/problems" className="block text-foreground hover:text-primary transition-colors duration-200 py-2">Problems</Link>
          <Link href="/duels" className="block text-foreground hover:text-primary transition-colors duration-200 py-2">Duels</Link>
          <Link href="/contest" className="block text-foreground hover:text-primary transition-colors duration-200 py-2">Contests</Link>
          <Link href="/explore" className="block text-foreground hover:text-primary transition-colors duration-200 py-2">Explore</Link>
          <Link href="/interview" className="block text-foreground hover:text-primary transition-colors duration-200 py-2">Interview</Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-primary">@{user.username}</span>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-secondary">Login</Link>
            <Link href="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
