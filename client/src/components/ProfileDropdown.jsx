'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';


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
        <div className="relative" ref={ref}>
            <img
                src={user?.photo || '/avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary hover:border-accent transition-all duration-200"
                onClick={() => setOpen((prev) => !prev)}
            />

            {open && user && (
                <div className="absolute right-0 mt-2 w-64 bg-card-bg rounded-lg shadow-lg py-2 z-50 border border-card-border animate-fade-in-down">
                    <Link className="block px-4 py-2 text-foreground hover:bg-background-light border-b border-card-border" href={`/${user.username}`}>
                        <p className="font-bold text-primary">{user?.name}</p>
                        <p className="text-sm text-muted">
                            Access all features with our Premium subscription!
                        </p>
                    </Link>

                    <div className="grid grid-cols-2 gap-2 p-4 border-b border-card-border">
                        <Link href="/dashboard" className="text-foreground hover:text-primary text-sm">Dashboard</Link>
                        <Link href="/submissions" className="text-foreground hover:text-primary text-sm">Submissions</Link>
                        <Link href="/duels" className="text-foreground hover:text-primary text-sm">My Duels</Link>
                        <Link href="/progress" className="text-foreground hover:text-primary text-sm">Progress</Link>
                    </div>

                    <div className="p-4 border-b border-card-border space-y-2">
                        <Link href="/features" className="block text-foreground hover:text-primary text-sm">Try New Features</Link>
                        <Link href="/playgrounds" className="block text-foreground hover:text-primary text-sm">My Playgrounds</Link>
                        <Link href="/settings" className="block text-foreground hover:text-primary text-sm">Settings</Link>
                    </div>

                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-error hover:bg-background-light rounded-b-lg">
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
