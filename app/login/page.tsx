'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push('/users')
      router.refresh()
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'Failed to login',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
      <div className="fixed left-0 top-0 h-screen w-1/3 bg-gradient-to-br from-[#D0BCFF]/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="relative bg-[#2B2930] rounded-3xl p-8 shadow-xl border border-[#48464C]/30 backdrop-blur-xl">
          <div className="absolute -top-12 -right-12 w-24 h-24 border-4 border-[#D0BCFF]/20 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-16 h-16 border-4 border-[#D0BCFF]/10 rounded-full" />

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D0BCFF] to-[#381E72] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D0BCFF] to-[#381E72] bg-clip-text text-transparent">
              Admin
            </h1>
          </div>

          <h2 className="text-2xl font-semibold text-[#E6E1E5] mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  aria-label="Email"
                  placeholder="Enter your email"
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                  required
                />
                <svg className="w-5 h-5 text-[#CAC4D0] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                   aria-label="Password"
                  placeholder="Enter your password"
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                  required
                />
                <svg className="w-5 h-5 text-[#CAC4D0] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#D0BCFF] to-[#9A82DB] text-[#381E72] rounded-xl font-medium hover:from-[#E8DEF8] hover:to-[#B69DF8] transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#D0BCFF]/20"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#381E72] border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </div>
              ) : 'Login'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#48464C]/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#2B2930] text-[#CAC4D0]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => signIn('google', { callbackUrl: '/users' })}
                className="flex items-center justify-center px-4 py-2 border border-[#48464C]/30 rounded-xl hover:bg-[#48464C]/10 transition-colors"
              >
                <svg className="w-5 h-5 text-[#E6E1E5]" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                <span className="ml-2 text-[#E6E1E5]">Google</span>
              </button>

              <button
                onClick={() => signIn('github', { callbackUrl: '/users' })}
                className="flex items-center justify-center px-4 py-2 border border-[#48464C]/30 rounded-xl hover:bg-[#48464C]/10 transition-colors"
              >
                <svg className="w-5 h-5 text-[#E6E1E5]" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
                <span className="ml-2 text-[#E6E1E5]">GitHub</span>
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-[#CAC4D0]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#D0BCFF] hover:text-[#E8DEF8]">
              Register
            </Link>
          </p>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 h-screen w-1/3 bg-gradient-to-tl from-[#381E72]/20 to-transparent pointer-events-none" />
    </div>
  )
} 