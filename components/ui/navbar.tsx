'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { getDefaultAvatar } from './avatar'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-[#1C1B1F]/50 backdrop-blur-xl fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-[#E6E1E5] text-xl font-medium">
              Home
            </Link>
            <nav className="ml-8">
              <Link 
                href="/appointment" 
                className="text-[#E6E1E5] hover:text-[#D0BCFF] transition-colors duration-200"
              >
                Book Appointment
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-[#48464C]/50 animate-pulse" />
            ) : session?.user ? (
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-full hover:bg-[#48464C] transition-colors duration-200">
                  <span className="text-[#E6E1E5] text-sm">{session.user.name}</span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#D0BCFF]">
                    <Image
                      src={session.user.image || getDefaultAvatar(session.user.email)}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>

                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#2B2930] shadow-lg ring-1 ring-[#48464C] py-1 scale-0 group-hover:scale-100 transition-transform duration-200 origin-top-right">
                  <Link
                    href="/settings/profile"
                    className="block px-4 py-2 text-sm text-[#E6E1E5] hover:bg-[#48464C] transition-colors duration-200"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full px-4 py-2 text-sm text-[#E6E1E5] hover:bg-[#48464C] text-left transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 