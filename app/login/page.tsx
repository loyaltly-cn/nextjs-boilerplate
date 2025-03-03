'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'
import { md5 } from '@/lib/utils'
import { useLanguage } from '@/app/language';
export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { translations } = useLanguage();
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
        password: md5(formData.password),
        redirect: false
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          throw new Error('邮箱或密码错误')
        }
        throw new Error(result.error)
      }

      const response = await fetch('/server/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: md5(formData.password),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登录失败');
      }

      const userData = await response.json();
      if(userData.data.isAdmin){
        toast('登录成功', 'success')
        router.push('/')
      }else toast('您没有权限', 'error')


    } catch (error) {
      console.log(error);
      
      toast(
        error instanceof Error ? error.message : '登录失败',
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D0BCFF] to-[#381E72] bg-clip-text text-transparent text-white">
              {translations.login.title}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                {translations.login.email}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  aria-label="Email"
                  placeholder={translations.login.pl_email}
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
                {translations.login.password}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                   aria-label="Password"
                  placeholder={translations.login.pl_password}
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
              ) : translations.login.title}
            </button>
          </form>

 

          {/* <p className="mt-4 text-center text-[#CAC4D0]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#D0BCFF] hover:text-[#E8DEF8]">
              Register
            </Link>
          </p> */}
        </div>
      </div>

      <div className="fixed right-0 bottom-0 h-screen w-1/3 bg-gradient-to-tl from-[#381E72]/20 to-transparent pointer-events-none" />
    </div>
  )
} 