import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/ui/navbar'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-[#1C1B1F]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {session ? (
          // 已登录用户看到的内容
          <div className="text-[#E6E1E5]">
            <h1 className="text-4xl font-bold">Welcome back, {session.user?.name}!</h1>
            <p className="mt-4 text-[#CAC4D0]">
              You're now signed in to your account.
            </p>
            <div className="mt-8">
              <Link
                href="/appointment"
                className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                立即预约
              </Link>
            </div>
          </div>
        ) : (
          // 未登录用户看到的内容
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#E6E1E5] animate-[fadeIn_0.5s_ease-in-out]">
              Welcome to Our Platform
            </h1>
            <p className="mt-4 text-xl text-[#CAC4D0] animate-[fadeIn_0.5s_ease-in-out_0.1s]">
              Sign in to access all features and get started.
            </p>
            <div className="mt-8 space-y-4 animate-[fadeIn_0.5s_ease-in-out_0.2s]">
              <Link
                href="/appointment"
                className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-[1.02] active:scale-95 mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                立即预约
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
