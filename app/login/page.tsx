'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Ripple } from '@/components/ui/ripple'
import { toast } from '@/components/ui/toast'
import { md5 } from '@/lib/utils'

// 添加一个简单的淡入动画类
const fadeIn = "animate-[fadeIn_0.3s_ease-in-out]"
const slideUp = "animate-[slideUp_0.3s_ease-out]"

interface FormData {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 实时验证
    validateField(name as keyof FormData, value)
  }

  const validateField = (name: keyof FormData, value: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      
      switch (name) {
        case 'email':
          if (!value) {
            newErrors.email = 'Email is required'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.email = 'Please enter a valid email address'
          } else {
            delete newErrors.email
          }
          break
        case 'password':
          if (!value) {
            newErrors.password = 'Password is required'
          } else if (value.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
          } else {
            delete newErrors.password
          }
          break
      }
      
      return newErrors
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { email, password } = formData

    // 表单验证
    let hasError = false
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      hasError = true
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }))
      hasError = true
    }
    if (hasError) return

    try {
      setIsLoading(true)
      const result = await signIn('credentials', {
        email,
        password: md5(password),
        redirect: false,
      })

      if (result?.error) {
        toast(result.error, 'error')
      } else {
        toast('Login successful', 'success')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      toast('An error occurred during login', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-[#1C1B1F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${fadeIn}`}>
      <div className={`sm:mx-auto sm:w-full sm:max-w-md ${slideUp}`}>
        <h2 className="mt-6 text-center text-3xl font-normal text-[#E6E1E5] animate-[fadeIn_0.5s_ease-in-out]">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[#CAC4D0] animate-[fadeIn_0.5s_ease-in-out_0.1s]">
          Sign in to your account to continue
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${slideUp} animate-[fadeIn_0.5s_ease-in-out_0.2s]`}>
        <div className="bg-[#2B2930] py-8 px-4 shadow-lg sm:rounded-3xl sm:px-10 transition-all duration-300 hover:shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#E6E1E5]">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`
                    appearance-none block w-full px-4 py-3 border-0 rounded-xl 
                    text-[#E6E1E5] bg-[#48464C] placeholder-[#CAC4D0] 
                    focus:outline-none focus:ring-2 
                    ${errors.email ? 'ring-2 ring-[#F2B8B5] focus:ring-[#F2B8B5]' : 'ring-[#48464C] focus:ring-[#D0BCFF]'}
                    transition-all duration-300 hover:bg-[#4A484E] focus:scale-[1.02]
                  `}
                  placeholder="Enter your email"
                />
                <div className="mt-1 min-h-[18px] transition-all duration-200">
                  {errors.email && (
                    <div className="text-[#F2B8B5] text-xs animate-[slideUp_0.2s_ease-out] pl-1">
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#E6E1E5]">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`
                    appearance-none block w-full px-4 py-3 border-0 rounded-xl 
                    text-[#E6E1E5] bg-[#48464C] placeholder-[#CAC4D0] 
                    focus:outline-none focus:ring-2 
                    ${errors.password ? 'focus:ring-[#F2B8B5] ring-2 ring-[#F2B8B5]' : 'focus:ring-[#D0BCFF]'}
                    transition-all duration-300 hover:bg-[#4A484E] focus:scale-[1.02]
                  `}
                  placeholder="Enter your password"
                />
                <div className="mt-1 min-h-[20px]">
                  {errors.password && (
                    <div className="flex items-center space-x-1 text-[#F2B8B5] text-xs animate-[slideUp_0.2s_ease-out]">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-10v6h2V7h-2z"/>
                      </svg>
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#D0BCFF] focus:ring-[#D0BCFF] border-[#CAC4D0] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#E6E1E5]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/forgot-password" 
                  className="font-medium text-[#D0BCFF] hover:text-[#E8DEF8]"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1B1F] focus:ring-[#D0BCFF] transition-all duration-300 hover:scale-[1.02] active:scale-95 elevation-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                data-ripple
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#381E72]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
                <Ripple color="rgba(56, 30, 114, 0.15)" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#48464C]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#2B2930] text-[#CAC4D0]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => signIn('google')}
                className="relative w-full inline-flex justify-center items-center py-3 px-4 rounded-full border border-[#48464C] bg-[#2B2930] text-sm font-medium text-[#E6E1E5] hover:bg-[#48464C] transition-all duration-300 hover:scale-[1.02] active:scale-95 elevation-1 overflow-hidden"
                data-ripple
              >
                <img src="/google.svg" alt="Google" className="h-5 w-5" />
                <span className="ml-2">Google</span>
                <Ripple />
              </button>
              <button
                type="button"
                onClick={() => signIn('github')}
                className="relative w-full inline-flex justify-center items-center py-3 px-4 rounded-full border border-[#48464C] bg-[#2B2930] text-sm font-medium text-[#E6E1E5] hover:bg-[#48464C] transition-all duration-300 hover:scale-[1.02] active:scale-95 elevation-1 overflow-hidden"
                data-ripple
              >
                <img src="/github.svg" alt="GitHub" className="h-5 w-5" />
                <span className="ml-2">GitHub</span>
                <Ripple />
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#CAC4D0]">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-[#D0BCFF] hover:text-[#E8DEF8] transition-colors duration-200"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 