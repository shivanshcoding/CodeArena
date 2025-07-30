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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card w-full max-w-md p-10 rounded-3xl shadow-2xl backdrop-blur-md animate-fade-in">
        <h2 className="text-3xl font-extrabold mb-6 text-primary drop-shadow-lg text-center">Login</h2>
        {err && <p className="text-red-500 text-center mb-4">{err}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" name="email" placeholder="Email" className="w-full input rounded-xl px-4 py-3 text-base" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" className="w-full input rounded-xl px-4 py-3 text-base" onChange={handleChange} />
          <button type="submit" className="w-full btn btn-primary rounded-xl py-3 text-lg font-bold" >Login</button>
        </form>
      </div>
    </div>
  );
}
