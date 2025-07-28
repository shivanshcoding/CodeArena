'use client';
import { useState } from 'react';
import axios from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      login(res.data.user);
      router.push('/problems');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800">
      <div className="w-full max-w-md p-10 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-indigo-100 backdrop-blur-md animate-fade-in">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-900 dark:text-yellow-400 drop-shadow-lg text-center">Login</h2>
        {err && <p className="text-red-500 text-center mb-4">{err}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" name="email" placeholder="Email" className="w-full input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm px-4 py-3 text-base" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" className="w-full input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm px-4 py-3 text-base" onChange={handleChange} />
          <button type="submit" className="w-full btn-primary rounded-xl shadow-md hover:scale-105 transition-transform duration-200 py-3 text-lg font-bold" >Login</button>
        </form>
      </div>
    </div>
  );
}
