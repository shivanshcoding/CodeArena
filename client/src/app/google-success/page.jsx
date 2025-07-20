'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function GoogleSuccessPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      alert('No token received');
      router.push('/login');
      return;
    }

    console.log("URL Token:", token);
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded); // Optional

    // Save token in localStorage
    localStorage.setItem('token', token);

    // Fetch full user from backend
    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          login({ ...data.user, token }); // ✅ Save user + token in context

          // Redirect based on profile completion
          if (!data.user.username || !data.user.institute) {
            router.push('/complete-profile');
          } else {
            router.push('/');
          }
        } else {
          alert('Invalid user data');
          router.push('/login');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        alert('Something went wrong');
        router.push('/login');
      });
  }, []);

  return <p className="text-center mt-12">Logging you in...</p>;
}
