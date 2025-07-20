'use client';

import { useForm } from 'react-hook-form';
import axios from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompleteProfile() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // ✅ Auto redirect if profile already complete or user missing
    useEffect(() => {
        if (!user) {
            router.push('/');
        } else if (user.username && user.institute && user.age && user.linkedin) {
            router.push('/');
        }
    }, [user]);

    const checkUsername = async (username) => {
        if (!username) return false;
        try {
            const res = await axios.post('/auth/check-username', { username });
            console.log('✅ Backend says available:', res.data);  // <-- add this
            return res.data.available;
        } catch (err) {
            console.error('Username check error:', err);
            return false;
        }
    };



    // ✅ Submit updated profile
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axios.put('/profile/update', {
                ...data,
                email: user.email
            });
            setUser(res.data);
            router.push('/');
        } catch (err) {
            alert(err?.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* ✅ Username */}
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input
                        {...register('username', {
                            required: true,
                            validate: async (val) => {
                                const isAvailable = await checkUsername(val);
                                return isAvailable || 'Username is already taken';
                            }
                        })}
                        className="input"
                        placeholder="username"
                    />

                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}
                </div>

                {/* ✅ Institute */}
                <div>
                    <label className="block text-sm font-medium">Institute</label>
                    <input
                        {...register('institute', { required: 'Institute is required' })}
                        className="input"
                        placeholder="Your college or institute"
                    />
                    {errors.institute && (
                        <p className="text-red-500 text-sm">{errors.institute.message}</p>
                    )}
                </div>

                {/* ❌ FIXED: LinkedIn pattern check (was string not regex) */}
                <div>
                    <label className="block text-sm font-medium">LinkedIn</label>
                    <input
                        {...register('linkedin', {
                            required: 'LinkedIn is required',
                            pattern: {
                                value: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/.+$/i,
                                message: 'Enter a valid LinkedIn profile URL'
                            }
                        })}
                        className="input"
                        placeholder="LinkedIn profile link"
                    />
                    {errors.linkedin && (
                        <p className="text-red-500 text-sm">{errors.linkedin.message}</p>
                    )}
                </div>

                {/* ✅ Age */}
                <div>
                    <label className="block text-sm font-medium">Age</label>
                    <input
                        type="number"
                        {...register('age', {
                            required: 'Age is required',
                            min: { value: 13, message: 'Must be at least 13' },
                            max: { value: 100, message: 'Must be under 100' }
                        })}
                        className="input"
                        placeholder="Age"
                    />
                    {errors.age && (
                        <p className="text-red-500 text-sm">{errors.age.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </form>
        </div>
    );
}
