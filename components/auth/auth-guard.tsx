'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUserInfo } from '@/lib/store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const user = getUserInfo()
    const isPublicPath = pathname === '/login' || pathname === '/register'

    if (!user && !isPublicPath) {
      router.push('/login')
    }
  }, [router, pathname])

  return <>{children}</>
} 