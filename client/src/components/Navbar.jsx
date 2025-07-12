'use client';

import ProfileDropdown from './ProfileDropdown';



import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
                CodeArena
            </Link>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                    <Link href="/problems">Problems</Link>
                    <ProfileDropdown />
                </div>

                {user ? (
                    <>
                        <Link href={`/${user.username}`} className="hover:text-gray-300 transition">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                {user.username[0].toUpperCase()}
                            </div>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="hover:text-gray-300 transition">Login</Link>
                        <Link href="/register" className="hover:text-gray-300 transition">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}