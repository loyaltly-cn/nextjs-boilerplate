'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ripple } from '@/components/ui/ripple'

const fadeIn = "animate-[fadeIn_0.3s_ease-in-out]"
const slideUp = "animate-[slideUp_0.3s_ease-out]"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Failed to send reset email')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setError('Failed to send reset email')
    }
  }

  return (
    <div className={`min-h-screen bg-[#1C1B1F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${fadeIn}`}>
      <div className={`sm:mx-auto sm:w-full sm:max-w-md ${slideUp}`}>
        <h2 className="mt-6 text-center text-3xl font-normal text-[#E6E1E5] animate-[fadeIn_0.5s_ease-in-out]">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-[#CAC4D0] animate-[fadeIn_0.5s_ease-in-out_0.1s]">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${slideUp} animate-[fadeIn_0.5s_ease-in-out_0.2s]`}>
        <div className="bg-[#2B2930] py-8 px-4 shadow-lg sm:rounded-3xl sm:px-10 transition-all duration-300 hover:shadow-xl">
          {status === 'success' ? (
            <div className="rounded-lg bg-[#1B4B2C] p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#A6F4C5]">
                    Reset link sent
                  </h3>
                  <div className="mt-2 text-sm text-[#A6F4C5]">
                    <p>
                      Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/login"
                      className="font-medium text-[#D0BCFF] hover:text-[#E8DEF8] transition-colors duration-200"
                    >
                      Return to sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-[#601410] text-[#F2B8B5] px-4 py-3 rounded-lg" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#E6E1E5]">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border-0 rounded-xl text-[#E6E1E5] bg-[#48464C] placeholder-[#CAC4D0] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] transition-all duration-300 hover:bg-[#4A484E] focus:scale-[1.02]"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="relative w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1B1F] focus:ring-[#D0BCFF] transition-all duration-300 hover:scale-[1.02] active:scale-95 elevation-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  data-ripple
                >
                  {status === 'loading' ? 'Sending...' : 'Send reset link'}
                  <Ripple color="rgba(56, 30, 114, 0.15)" />
                </button>
              </div>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="font-medium text-[#D0BCFF] hover:text-[#E8DEF8] transition-colors duration-200"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 