'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'
import { md5 } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: md5(formData.password),
          name: formData.name
        })
      })

      const data = await response.json()

      if (data.code !== 200) {
        throw new Error(data.message)
      }

      router.push('/login')
      toast('注册成功，请登录', 'success')
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '注册失败',
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D0BCFF] to-[#381E72] bg-clip-text text-transparent">
              Register
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  aria-label="Name"
                  placeholder="Enter your name"
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                  required
                />
                <svg className="w-5 h-5 text-[#CAC4D0] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
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
              ) : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-[#CAC4D0]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D0BCFF] hover:text-[#E8DEF8]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 