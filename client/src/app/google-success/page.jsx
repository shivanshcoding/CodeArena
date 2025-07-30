'use client';

import { useEffect,useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function GoogleSuccessPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('No authentication token received');
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    try {
      console.log("URL Token received");
      const decoded = jwtDecode(token);
      console.log("Token decoded successfully");

      // Save token in localStorage
      localStorage.setItem('token', token);

      // Fetch full user from backend
      setStatus('authenticating');
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.user) {
            console.log('User data received successfully');
            login({ ...data.user, token }); // ✅ Save user + token in context

            setStatus('success');
            // Redirect based on profile completion
            if (!data.user.username || !data.user.institute) {
              setTimeout(() => router.push('/complete-profile'), 1000);
            } else {
              setTimeout(() => router.push('/'), 1000);
            }
          } else {
            console.error('Invalid user data received:', data);
            setStatus('error');
            setError('Authentication failed: Invalid user data');
            setTimeout(() => router.push('/login'), 3000);
          }
        })
        .catch(err => {
          console.error('Authentication error:', err);
          setStatus('error');
          setError('Authentication failed: ' + (err.message || 'Unknown error'));
          setTimeout(() => router.push('/login'), 3000);
        });
    } catch (err) {
      console.error('Token processing error:', err);
      setStatus('error');
      setError('Invalid authentication token');
      setTimeout(() => router.push('/login'), 3000);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4 sm:p-6">
      <div className="card max-w-md w-full p-8 text-center animate-fade-in">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-3xl font-extrabold text-primary drop-shadow-lg mb-3">Processing Login</h2>
            <p className="text-muted text-lg">Please wait while we authenticate you...</p>
          </div>
        )}

        {status === 'authenticating' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 drop-shadow-lg mb-3">Authenticating</h2>
            <p className="text-gray-300 text-lg">Verifying your account details...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="bg-green-600 bg-opacity-30 text-green-300 rounded-full p-5 w-fit mx-auto mb-6 shadow-lg animate-bounce-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 drop-shadow-lg mb-3">Login Successful!</h2>
            <p className="text-gray-300 text-lg">Redirecting you to CodeArena...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="bg-red-600 bg-opacity-30 text-red-300 rounded-full p-5 w-fit mx-auto mb-6 shadow-lg animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 drop-shadow-lg mb-3">Authentication Failed</h2>
            <p className="text-error text-lg mb-4">{error}</p>
            <p className="text-gray-300 text-lg">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
