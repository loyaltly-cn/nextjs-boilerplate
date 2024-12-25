'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { toast } from '@/components/ui/toast'
import { Navbar } from '@/components/ui/navbar'

export default function ProfileSettings() {
  const { data: session, update: updateSession } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      toast('Name is required', 'error')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error()

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name
        }
      })

      toast('Profile updated successfully', 'success')
    } catch (error) {
      toast('Failed to update profile', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          image: data.avatarUrl
        }
      })

      toast('Avatar updated successfully', 'success')
    } catch (error) {
      toast('Failed to update avatar', 'error')
    }
  }

  return (
    <main className="min-h-screen bg-[#1C1B1F]">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="bg-[#2B2930] rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-[#E6E1E5] mb-8">Profile Settings</h1>
          
          <div className="mb-8">
            <AvatarUpload
              currentAvatar={session?.user?.image}
              email={session?.user?.email}
              onUpload={handleAvatarUpload}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#E6E1E5]">
                Display Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-xl text-[#E6E1E5] bg-[#48464C] border-0 focus:ring-2 focus:ring-[#D0BCFF] transition-all duration-200"
                placeholder="Enter your name"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1B1F] focus:ring-[#D0BCFF] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 