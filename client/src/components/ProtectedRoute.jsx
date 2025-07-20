'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 🚪 redirect to login if not logged in
    }
  }, [user, loading]);

  if (loading || !user) {
    return <div className="text-center mt-12 text-gray-500">Checking authentication...</div>;
  }

  return children;
}
