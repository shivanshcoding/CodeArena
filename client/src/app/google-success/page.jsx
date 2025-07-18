// app/google-success/page.jsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import axios from '@/lib/api';

export default function GoogleSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (!token) return;

    localStorage.setItem('token', token);
    axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => {
      login(res.data.user);
      router.push('/complete-profile'); // ⬅ or '/' if user is already complete
    }).catch(() => {
      alert('Google login failed.');
    });
  }, []);
  
  return <div className="text-center mt-20">Logging in via Google...</div>;
}
