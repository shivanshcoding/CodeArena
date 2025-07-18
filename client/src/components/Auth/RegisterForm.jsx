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
            className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg space-y-4"
        >
            <h2 className="text-2xl font-bold text-center">Create an Account</h2>

            <input {...register('name', { required: true })} placeholder="Full Name" className="input" />
            {errors.name && <p className="text-red-500 text-sm">Name is required.</p>}

            <input {...register('institute', { required: true })} placeholder="Institute" className="input" />
            {errors.institute && <p className="text-red-500 text-sm">Institute is required.</p>}

            <input
                {...register('linkedin', { required: true, validate: validateLinkedIn })}
                placeholder="LinkedIn Profile URL"
                className="input"
            />
            {errors.linkedin && <p className="text-red-500 text-sm">Invalid LinkedIn URL.</p>}

            <input {...register('age', { required: true, min: 13 })} placeholder="Age" type="number" className="input" />
            {errors.age && <p className="text-red-500 text-sm">Valid age is required (13+).</p>}

            <input {...register('email', { required: true })} placeholder="Email" type="email" className="input" />
            {errors.email && <p className="text-red-500 text-sm">Email is required.</p>}

            <input {...register('password', { required: true, minLength: 6 })} placeholder="Password" type="password" className="input" />
            {errors.password && <p className="text-red-500 text-sm">Password must be 6+ characters.</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="text-center text-sm">or</div>

            <button
                type="button"
                onClick={googleLogin}
                className="w-full flex items-center justify-center gap-2 border py-2 rounded-xl hover:bg-gray-100 transition"
            >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>
        </form>
    )
}
