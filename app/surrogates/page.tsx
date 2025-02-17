'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/toast'

interface Application {
    id:             string
    name:           String
    age:            number
    birthDate:      Date
    height:         number
    weight:         number
    ethnicity:      String
    education:      String
    maritalStatus:  String
    hasChildren:    String
    address:        String
    city:           String
    state:          String
    postalCode:     String
    country:        String
    phoneNumber:    String
    email:          String
    createdAt:      Date
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
      const res = await fetch('/server/api/surrogate-mother-applications')
      const data = await res.json()
      
      setApplications(data)
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
    return (
      <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D0BCFF]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#E6E1E5]">Surrogacy sd</h1>
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
                    {application.name}
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
                  <p>age: {application.age}</p>
                  <p>birthDate: {new Date(application.birthDate).toLocaleDateString()}</p>
                  <p>Address: {application.address}</p>
                  <p>City: {application.city}</p>
                  <p>Postal Code: {application.postalCode}</p>
                  <p>Phone: {application.phoneNumber}</p>
                  <p>Height: {application.height} cm</p>
                  <p>Weight: {application.weight} kg</p>
                  <p>Ethnicity: {application.ethnicity}</p>
                  <p>Education: {application.education}</p>
                  <p>Marital Status: {application.maritalStatus}</p>
                  <p>Has Children: {application.hasChildren}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 