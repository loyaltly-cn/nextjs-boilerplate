'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChatAssistant } from './chat-assistant'

const HIDDEN_PATHS: string[] = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/settings/profile'
]

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const shouldShowChat = !HIDDEN_PATHS.some(path => pathname.startsWith(path)) && session

  return (
    <>
      {children}
      {shouldShowChat && <ChatAssistant />}
    </>
  )
} 