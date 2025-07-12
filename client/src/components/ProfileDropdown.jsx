'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import '@/styles/ProfileDropdown.css';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown-wrapper" ref={ref}>
      <img
        src="/avatar.png"
        alt="Profile"
        className="profile-avatar"
        onClick={toggleDropdown}
      />

      {open && (
        <div className="profile-dropdown">
          <p className="profile-name">{user?.name}</p>
          <p className="profile-sub">Access all features with our Premium subscription!</p>

          <div className="profile-grid">
            <Link href="/my-lists">My Lists</Link>
            <Link href="/submissions">Submissions</Link>
            <Link href="/progress">Progress</Link>
            <Link href="/points">Points</Link>
          </div>

          <Link href="/features">Try New Features</Link>
          <Link href="/playgrounds">My Playgrounds</Link>
          <Link href="/settings">Settings</Link>

          <button onClick={logout} className="logout-btn">Sign Out</button>
        </div>
      )}
    </div>
  );
}
