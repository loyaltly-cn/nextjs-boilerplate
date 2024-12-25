'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ripple } from '@/components/ui/ripple'
import { toast } from '@/components/ui/toast'
import { md5 } from '@/lib/utils'

const fadeIn = "animate-[fadeIn_0.3s_ease-in-out]"
const slideUp = "animate-[slideUp_0.3s_ease-out]"

export default function Register() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: md5(password),
          name 
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to register')
      }

      toast('Registration successful', 'success')
      router.push('/login')
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'Failed to register',
        'error'
      )
    }
  }

  return (
    <div className={`min-h-screen bg-[#1C1B1F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${fadeIn}`}>
      <div className={`sm:mx-auto sm:w-full sm:max-w-md ${slideUp}`}>
        <h2 className="mt-6 text-center text-3xl font-normal text-[#E6E1E5] animate-[fadeIn_0.5s_ease-in-out]">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#CAC4D0] animate-[fadeIn_0.5s_ease-in-out_0.1s]">
          Sign up to get started
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${slideUp} animate-[fadeIn_0.5s_ease-in-out_0.2s]`}>
        <div className="bg-[#2B2930] py-8 px-4 shadow-lg sm:rounded-3xl sm:px-10 transition-all duration-300 hover:shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#601410] text-[#F2B8B5] px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#E6E1E5]">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border-0 rounded-xl text-[#E6E1E5] bg-[#48464C] placeholder-[#CAC4D0] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] transition-all duration-300 hover:bg-[#4A484E] focus:scale-[1.02]"
                  placeholder="Enter your name"
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#E6E1E5]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border-0 rounded-xl text-[#E6E1E5] bg-[#48464C] placeholder-[#CAC4D0] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] transition-all duration-300 hover:bg-[#4A484E] focus:scale-[1.02]"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1B1F] focus:ring-[#D0BCFF] transition-all duration-300 hover:scale-[1.02] active:scale-95 elevation-2 overflow-hidden"
                data-ripple
              >
                Sign up
                <Ripple color="rgba(56, 30, 114, 0.15)" />
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-[#CAC4D0]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-[#D0BCFF] hover:text-[#E8DEF8] transition-colors duration-200"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 