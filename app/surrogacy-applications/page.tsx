'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/toast'
import Link from 'next/link'

interface Application {
  id: string
  userId: string
  name: string | null
  email: string | null
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  dateOfBirth: string
  partnerName: string
  partnerDateOfBirth: string
  answers: Array<{
    id: string
    value: string
  }>
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function SurrogacyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/server/api/surrogacy-applications')
      const data = await res.json()
      if (data.code === 200) {
        setApplications(data.data)
      }
    } catch (error) {
      toast('Failed to fetch applications', 'error')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#E6E1E5]">Surrogacy Applications</h1>
        <Link
          href="/surrogacy-applications/new"
          className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-lg hover:bg-[#D0BCFF]/90 transition-colors"
        >
          New Application
        </Link>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="bg-[#2B2930] rounded-3xl border border-[#48464C]/30 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#E6E1E5] font-medium">
                    {application.name || application.user.name || application.user.email}
                  </h3>
                  <p className="text-[#CAC4D0] text-sm">
                    Submitted: {new Date(application.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(application.id)}
                  className="px-4 py-2 text-[#D0BCFF] hover:bg-[#48464C]/30 rounded-xl transition-colors"
                >
                  {expandedId === application.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              {expandedId === application.id && (
                <div className="mt-4 text-[#CAC4D0]">
                  <p>Email: {application.email}</p>
                  <p>User ID: {application.userId}</p>
                  <p>Address: {application.address}</p>
                  <p>City: {application.city}</p>
                  <p>State: {application.state}</p>
                  <p>Postal Code: {application.postalCode}</p>
                  <p>Country: {application.country}</p>
                  <p>Phone: {application.phone}</p>
                  <p>Date of Birth: {application.dateOfBirth}</p>
                  <p>Partner Name: {application.partnerName}</p>
                  <p>Partner Date of Birth: {application.partnerDateOfBirth}</p>
                  <div>
                    <p>Options:</p>
                    <ul className="list-disc pl-5">
                      {application.answers.map(answer => (
                        <li key={answer.id}>
                          <strong>{answer.id}:</strong> {answer.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Add more fields as needed */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 