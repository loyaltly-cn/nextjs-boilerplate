'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/toast'
import { md5 } from '@/lib/utils'

export default function AccountPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast('New passwords do not match', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/users/${session?.user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: md5(passwords.currentPassword),
          newPassword: md5(passwords.newPassword)
        })
      })

      const data = await res.json()
      if (data.code === 200) {
        toast('Password updated successfully', 'success')
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast(data.message || 'Failed to update password', 'error')
      }
    } catch (error) {
      toast('Failed to update password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#E6E1E5] mb-8">Account Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={e => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
            placeholder="Enter your current password"
            aria-label="Current Password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
            New Password
          </label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={e => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
            placeholder="Enter your new password"
            aria-label="New Password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={e => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
            placeholder="Confirm your new password"
            aria-label="Confirm New Password"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
} 