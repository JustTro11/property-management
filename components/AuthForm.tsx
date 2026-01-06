'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from '@/lib/navigation'
import { Lock, Mail, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export default function AuthForm() {
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        setAuthError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) throw error

            router.refresh()
            setTimeout(() => {
                router.push('/admin')
            }, 500)

        } catch (error: any) {
            setAuthError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">Admin Access</h2>
                <p className="mt-2 text-sm text-zinc-400">
                    Sign in to manage your properties
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-zinc-500" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-zinc-950/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-indigo-500'}`}
                                placeholder="Email address"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-zinc-500" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-zinc-950/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-indigo-500'}`}
                                placeholder="Password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>}
                    </div>
                </div>

                {authError && (
                    <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-400">Login Failed</h3>
                                <div className="mt-2 text-sm text-red-500/80">
                                    <p>{authError}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>
        </div>
    )
}
