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
                <Link href="/problems" className="text-white hover:text-gray-300">Problems</Link>


                {user ? (
                    <>
                        <div className="flex items-center space-x-4">
                            <ProfileDropdown />
                        </div>
                    </>
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