'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import '@/styles/ProfileDropdown.css';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!hydrated) return null;

  const handleSignOut = () => {
    logout();             // Clear context and localStorage
    setOpen(false);       // Close dropdown
    router.push('/');     // Redirect to homepage
  };

  return (
    <div className="profile-dropdown-wrapper" ref={ref}>
      <img
        src="/avatar.png"
        alt="Profile"
        className="profile-avatar"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && user && (
        <div className="profile-dropdown">
          <Link className="profile-button" href={`/${user.username}`}>
            <p className="profile-name">{user?.name}</p>
            <p className="profile-sub">
              Access all features with our Premium subscription!
            </p>
          </Link>

          <div className="profile-grid">
            <Link href="/my-lists">My Lists</Link>
            <Link href="/submissions">Submissions</Link>
            <Link href="/progress">Progress</Link>
            <Link href="/points">Points</Link>
          </div>

          <div className="profile-tags">
            <Link href="/features">Try New Features</Link>
            <Link href="/playgrounds">My Playgrounds</Link>
            <Link href="/settings">Settings</Link>
          </div>

          <button onClick={handleSignOut} className="logout-btn">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
