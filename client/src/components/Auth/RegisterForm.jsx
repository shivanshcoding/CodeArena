'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { validateLinkedIn } from '@/lib/validation'
import api from '@/lib/api'




export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const res = await api.post('/auth/register', data)

            if (res.status === 201 || res.status === 200) {
                alert('✅ Registered successfully!')
            } else {
                alert('❌ Something went wrong.')
            }
        } catch (err) {
            console.error(err)
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Registration failed.'
            alert(`❌ ${msg}`)
        } finally {
            setLoading(false)
        }
    }

    const googleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google'
    }


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="card p-10 w-full max-w-xl space-y-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-indigo-100 backdrop-blur-md animate-fade-in"
        >
            <div className="text-center">
                <h2 className="text-3xl font-extrabold mb-2 text-indigo-900 dark:text-yellow-400 drop-shadow-lg">Create an Account</h2>
                <p className="text-muted text-base">Join CodeArena to start your coding journey</p>
            </div>
            <div className="space-y-1">
                <label className="block text-base font-semibold text-indigo-900 dark:text-yellow-300">Full Name</label>
                <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className="input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm" />
                {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
                <label className="block text-base font-semibold text-indigo-900 dark:text-yellow-300">Institute</label>
                <input {...register('institute', { required: 'Institute is required' })} placeholder="Your university or college" className="input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm" />
                {errors.institute && <p className="text-error text-sm">{errors.institute.message}</p>}
            </div>
            <div className="space-y-1">
                <label className="block text-base font-semibold text-indigo-900 dark:text-yellow-300">LinkedIn Profile</label>
                <input
                    {...register('linkedin', { 
                        required: 'LinkedIn profile is required', 
                        validate: (value) => validateLinkedIn(value) || 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)'
                    })}
                    placeholder="linkedin.com/in/username"
                    className="input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm"
                />
                {errors.linkedin && <p className="text-error text-sm">{typeof errors.linkedin.message === 'string' ? errors.linkedin.message : 'Invalid LinkedIn URL.'}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-base font-semibold text-indigo-900 dark:text-yellow-300">Age</label>
                    <input 
                        {...register('age', { 
                            required: 'Age is required', 
                            min: { value: 13, message: 'Must be at least 13 years old' } 
                        })} 
                        placeholder="18" 
                        type="number" 
                        className="input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm" 
                    />
                    {errors.age && <p className="text-error text-sm">{errors.age.message}</p>}
                </div>
            <div className="space-y-1">
                <label className="block text-base font-semibold text-indigo-900 dark:text-yellow-300">Email</label>
                <input 
                    {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                    })} 
                    placeholder="you@example.com" 
                    type="email" 
                    className="input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm" 
                />
                {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
            </div>
        </div>
        <div className="space-y-1">
            <label className="block text-base font-semibold text-indigo-900 dark:text-yellow-300">Password</label>
            <input 
                {...register('password', { 
                    required: 'Password is required', 
                    minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                })} 
                placeholder="••••••••" 
                type="password" 
                className="input bg-white/90 dark:bg-gray-800/80 border border-indigo-200 focus:border-indigo-500 rounded-xl shadow-sm" 
            />
            {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full rounded-xl shadow-md hover:scale-105 transition-transform duration-200" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white dark:bg-gray-800 px-2 text-base text-muted">or continue with</span>
            <div className="border-t border-gray-300 w-full"></div>
        </div>
        <button
            type="button"
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold shadow-sm"
        >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Google
        </button>
    </form>
    )
}
