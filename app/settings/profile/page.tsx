'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/toast'
import { DateTimePicker } from '@/components/ui/datetime-picker'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  })

  useEffect(() => {
    if (session?.user) {
      // 获取用户详细信息
      fetch(`/api/users/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setProfile({
              name: data.name || '',
              phoneNumber: data.phoneNumber || '',
              dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
              address: data.address || '',
              city: data.city || '',
              country: data.country || '',
              postalCode: data.postalCode || ''
            });
          }
        })
        .catch(() => toast('Failed to fetch profile', 'error'));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (res.ok) {
        toast('Profile updated successfully', 'success');
      } else {
        toast(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      toast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#E6E1E5] mb-8">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your name"
              aria-label="Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phoneNumber}
              onChange={e => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your phone number"
              aria-label="Phone Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              Date of Birth
            </label>
            <DateTimePicker
              value={profile.dateOfBirth}
              onChange={(date) => setProfile(prev => ({ ...prev, dateOfBirth: date }))}
              type="date"
              className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={e => setProfile(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your address"
              aria-label="Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              City
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={e => setProfile(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your city"
              aria-label="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              Country
            </label>
            <input
              type="text"
              value={profile.country}
              onChange={e => setProfile(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your country"
              aria-label="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={profile.postalCode}
              onChange={e => setProfile(prev => ({ ...prev, postalCode: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your postal code"
              aria-label="Postal Code"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
} 