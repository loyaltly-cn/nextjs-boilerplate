import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/ui/navbar'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to our appointment booking system',
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  const routes = [
    {
      name: 'User Management',
      href: '/users',
      description: 'Manage system users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Appointments',
      href: '/appointments',
      description: 'View all appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <main className="min-h-screen bg-[#1C1B1F]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {session ? (
          <div className="text-[#E6E1E5]">
            <h1 className="text-4xl font-bold mb-8">Welcome back, {session.user?.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center p-6 bg-[#2B2930] rounded-3xl border border-[#48464C]/30 hover:bg-[#48464C]/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#D0BCFF]/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#D0BCFF]/20 transition-colors">
                    <span className="text-[#D0BCFF]">{route.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-[#E6E1E5]">{route.name}</h2>
                    <p className="text-sm text-[#CAC4D0] mt-1">{route.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
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
