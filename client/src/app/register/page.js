'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from '@/lib/api'; // ✅ Ensure this points to your axios instance
import { useAuth } from '@/context/AuthContext'; // ✅ Make sure useAuth provides `login`

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const username = watch("username");
  const email = watch("email");

  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.trim().length < 3) return;
      try {
        const res = await axios.post('/auth/check-username', { username });
        setUsernameTaken(res.data.exists);
      } catch (err) {
        console.error("Username check failed:", err);
        setUsernameTaken(false);
      }
    };

    const debounce = setTimeout(checkUsername, 600);
    return () => clearTimeout(debounce);
  }, [username]);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !email.includes('@')) return;
      try {
        const res = await axios.post('/auth/check-email', { email });
        setEmailTaken(res.data.exists);
      } catch (err) {
        console.error("Email check failed:", err);
        setEmailTaken(false);
      }
    };

    const debounce = setTimeout(checkEmail, 600);
    return () => clearTimeout(debounce);
  }, [email]);

  const onSubmit = async (data) => {
    if (usernameTaken) {
      setError('username', { type: 'manual', message: 'Username already taken' });
      return;
    }
    if (emailTaken) {
      setError('email', { type: 'manual', message: 'Email already registered' });
      return;
    }

    try {
      const res = await axios.post('/auth/register', data);
      if (res.data?.user) {
        login(res.data.user);
        router.push('/problems');
      } else {
        setError('root', { type: 'manual', message: res.data.message || 'Registration failed' });
      }
    } catch (err) {
      console.error("Register error:", err);
      setError('root', { type: 'manual', message: 'Server error. Please try again.' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1f1f1f] text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create your Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name', { required: "Name is required" })} placeholder="Full Name" className="w-full p-2 rounded bg-[#2b2b2b]" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register('age', { min: { value: 0, message: "Enter valid age" } })} placeholder="Age" className="w-full p-2 rounded bg-[#2b2b2b]" />
        {errors.age && <p className="text-red-500">{errors.age.message}</p>}

        <input {...register('address')} placeholder="Address" className="w-full p-2 rounded bg-[#2b2b2b]" />

        <input {...register('username', { required: "Username required" })} placeholder="Username" className="w-full p-2 rounded bg-[#2b2b2b]" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        {username && usernameTaken && <p className="text-yellow-400 text-sm">Username already taken</p>}

        <input {...register('email', {
          required: "Email is required",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
        })} placeholder="Email" className="w-full p-2 rounded bg-[#2b2b2b]" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        {email && emailTaken && <p className="text-yellow-400 text-sm">Email already registered</p>}

        <input type="password" {...register('password', { required: "Password is required" })} placeholder="Password" className="w-full p-2 rounded bg-[#2b2b2b]" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold transition">
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      {errors.root && <p className="text-red-500 text-center mt-4">{errors.root.message}</p>}

      <div className="text-center mt-4 text-gray-400">
        Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
      </div>
    </div>
  );
}
