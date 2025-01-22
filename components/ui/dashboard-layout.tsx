'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/login' && pathname !== '/register') {
      router.push('/login')
    }
  }, [status, pathname, router])

  // 如果是登录或注册页面，只显示内容
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>
  }

  // 如果正在检查登录状态，可以显示加载状态
  if (status === 'loading') {
    return null // 或者显示加载动画
  }

  // 如果未登录，不显示任何内容（会被 useEffect 重定向）
  if (!session) {
    return null
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Users',
      href: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      adminOnly: true
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Chat List',
      href: '/chats',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      adminOnly: true
    },
    {
      name: 'About Video',
      href: '/about/video',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      adminOnly: true
    },
    {
      name: 'Surrogacy Applications',
      href: '/surrogacy-applications',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || session.user?.isAdmin
  )

  return (
    <div className="min-h-screen bg-[#1C1B1F] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#2B2930] border-r border-[#48464C]/30 sticky top-0 h-screen">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-[#48464C]/30">
            <span className="text-xl font-medium text-[#E6E1E5]">Admin Panel</span>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href 
              
              return (
                <div key={item.href}>
                   
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-xl
                        transition-colors duration-200
                        ${isActive 
                          ? 'text-[#381E72] bg-[#D0BCFF]' 
                          : 'text-[#E6E1E5] hover:bg-[#48464C]/30'
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                </div>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[#48464C]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#D0BCFF]">
                  <img
                    src="/default-avatar.png"
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="ml-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#E6E1E5] truncate">
                      {session.user?.name}
                    </p>
                    {session.user?.isAdmin && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-[#D0BCFF] text-[#381E72] rounded-full flex-shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#CAC4D0] truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="p-2 rounded-lg text-[#E6E1E5] hover:bg-[#48464C]/30 transition-colors duration-200 flex-shrink-0"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="p-6">
          {children}
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to login again to access the dashboard."
        onConfirm={() => {
          setShowLogoutDialog(false)
          signOut({ callbackUrl: '/login' })
        }}
        onCancel={() => setShowLogoutDialog(false)}
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  )
} 