'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/server/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      router.push('/login')
      toast('Registration successful! Please login.', 'success')
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'Failed to register',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#2B2930] rounded-3xl p-8 shadow-xl border border-[#48464C]/30">
          <h2 className="text-2xl font-semibold text-[#E6E1E5] mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                aria-label="Name"
                placeholder="Enter your name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                aria-label="Email"
                placeholder="Enter your email"
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                aria-label="Password"
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl font-medium hover:bg-[#E8DEF8] transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
          <p className="mt-4 text-center text-[#CAC4D0]">
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