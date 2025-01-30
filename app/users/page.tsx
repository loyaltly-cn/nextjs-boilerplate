'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Ripple } from '@/components/ui/ripple'
import { useLanguage } from '@/app/language';
interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  createdAt: string
}

const EmptyIcon = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="96" stroke="#48464C" strokeWidth="2" strokeDasharray="4 4"/>
    <g opacity="0.9">
      <circle cx="100" cy="75" r="22" fill="#48464C"/>
      <path d="M60 135C60 119.536 72.536 107 88 107H112C127.464 107 140 119.536 140 135V142C140 143.657 138.657 145 137 145H63C61.3431 145 60 143.657 60 142V135Z" fill="#48464C"/>
    </g>
    <circle cx="140" cy="60" r="24" fill="#2B2930" stroke="#48464C" strokeWidth="2"/>
    <path d="M140 52V68M132 60H148" stroke="#D0BCFF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users')
        if (!res.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUsers()
    }
  }, [session])

  const handleDeleteUser = async (id: string) => {
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete user')
      }

      setUsers(users.filter(user => user.id !== id))
      setDeleteUserId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D0BCFF]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
        <div className="bg-[#601410] text-[#F2B8B5] px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }
  const { translations } = useLanguage();
  return (
    <div className="min-h-screen bg-[#1C1B1F] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-normal text-[#E6E1E5] mb-8">{translations.user.title}</h1>
        
        {users.length === 0 ? (
          <div className="bg-[#2B2930] rounded-3xl shadow-lg p-20">
            <div className="flex flex-col items-center justify-center text-center">
              <EmptyIcon />
              <h3 className="mt-8 text-2xl font-normal text-[#E6E1E5]">
                Create your first user
              </h3>
              <p className="mt-3 text-[#CAC4D0] max-w-md text-base">
                Get started by creating a new user account. Users who sign up will automatically appear here.
              </p>
              <button
                onClick={() => router.push('/register')}
                className="mt-8 relative inline-flex items-center px-6 py-3 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
              >
                Create User
                <Ripple />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#2B2930] rounded-3xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#48464C]">
                    {
                      translations.user.th.map((th:string, index:number) => (
                        <th key={index} className="text-left p-4 text-[#CAC4D0]">{th}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-[#48464C] hover:bg-[#48464C] transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.image && (
                            <img 
                              src={user.image} 
                              alt={user.name || ''} 
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <span className="text-[#E6E1E5]">
                            {user.name || 'No name'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-[#E6E1E5]">{user.email}</td>
                      <td className="p-4 text-[#CAC4D0]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setDeleteUserId(user.id)}
                          className="text-[#F2B8B5] hover:text-[#F2B8B5] transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {deleteUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#2B2930] rounded-3xl p-6 max-w-md w-full animate-[slideUp_0.2s_ease-out]">
            <h3 className="text-xl font-normal text-[#E6E1E5] mb-4">
              Delete User
            </h3>
            <p className="text-[#CAC4D0] mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 rounded-full text-[#E6E1E5] hover:bg-[#48464C] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteUserId)}
                disabled={isDeleting}
                className="relative px-4 py-2 rounded-full text-[#F2B8B5] bg-[#601410] hover:bg-[#701810] transition-colors duration-200 disabled:opacity-50 overflow-hidden"
                data-ripple
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
                <Ripple color="rgba(242, 184, 181, 0.15)" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 