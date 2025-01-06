'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

export default function NewSurrogacyApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    dateOfBirth: '',
    partnerName: '',
    partnerDateOfBirth: '',
    answers: [] as Array<{ id: string, value: string }>
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/surrogacy-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.code === 200) {
        toast('Application submitted successfully')
        router.push('/surrogacy-applications')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast('Failed to submit application', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#E6E1E5]">New Surrogacy Application</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your name"
              aria-label="Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your email"
              aria-label="Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your phone number"
              aria-label="Phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              aria-label="Date of Birth"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
            placeholder="Enter your address"
            aria-label="Address"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your city"
              aria-label="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">State/Province</label>
            <input
              type="text"
              value={formData.state}
              onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your state or province"
              aria-label="State or Province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Postal Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={e => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your postal code"
              aria-label="Postal Code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter your country"
              aria-label="Country"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Partner Name</label>
            <input
              type="text"
              value={formData.partnerName}
              onChange={e => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              placeholder="Enter partner's name"
              aria-label="Partner Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Partner Date of Birth</label>
            <input
              type="date"
              value={formData.partnerDateOfBirth}
              onChange={e => setFormData(prev => ({ ...prev, partnerDateOfBirth: e.target.value }))}
              className="w-full px-4 py-2 bg-[#2B2930] border border-[#48464C]/30 rounded-lg text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
              aria-label="Partner Date of Birth"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-[#CAC4D0] hover:bg-[#48464C]/30 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#D0BCFF] text-[#381E72] rounded-lg hover:bg-[#D0BCFF]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
} 