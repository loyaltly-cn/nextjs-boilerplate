'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/toast'
import { DialogForm } from '@/components/ui/dialog-form'
import { DateTimePicker } from '@/components/ui/datetime-picker'

interface User {
  id: string
  name: string | null
  email: string
  phoneNumber: string | null
  dateOfBirth: string | null
  address: string | null
  city: string | null
  country: string | null
  postalCode: string | null
}

interface Appointment {
  id: string
  userId: string
  appointmentTime: string
  createdAt: string
  user: User
  type: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      if (data.code === 200) {
        setAppointments(data.data)
        console.log(data.data)
      }
    } catch (error) {
      toast('Failed to fetch appointments', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#E6E1E5] mb-8">Appointments</h1>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-[#2B2930] rounded-3xl border border-[#48464C]/30 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#D0BCFF]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#E6E1E5] font-medium">
                      {appointment.user.name || appointment.user.email}
                    </h3>
                    <div className="flex items-center gap-2 text-[#CAC4D0] text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Appointment Time: {new Date(appointment.appointmentTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#CAC4D0] text-sm mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created: {new Date(appointment.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(showDetails === appointment.id ? null : appointment.id)}
                  className="px-4 py-2 text-[#D0BCFF] hover:bg-[#48464C]/30 rounded-xl transition-colors"
                >
                  {showDetails === appointment.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {showDetails === appointment.id && (
                <div className="mt-6 pt-6 border-t border-[#48464C]/30">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#CAC4D0] text-sm mb-1">Email</p>
                      <p className="text-[#E6E1E5]">{appointment.user.email}</p>
                    </div>
                    {
                      appointment.type && (
                        <div>
                          <p className="text-[#CAC4D0] text-sm mb-1">type</p>
                          <p className="text-[#E6E1E5]">{appointment.type}</p>
                        </div>
                      )
                    }
                    {appointment.user.dateOfBirth && (
                      <div>
                        <p className="text-[#CAC4D0] text-sm mb-1">Date of Birth</p>
                        <p className="text-[#E6E1E5]">
                          {new Date(appointment.user.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {appointment.user.phoneNumber && (
                      <div>
                        <p className="text-[#CAC4D0] text-sm mb-1">Phone</p>
                        <p className="text-[#E6E1E5]">{appointment.user.phoneNumber}</p>
                      </div>
                    )}
                    {appointment.user.address && (
                      <div>
                        <p className="text-[#CAC4D0] text-sm mb-1">Address</p>
                        <p className="text-[#E6E1E5]">{appointment.user.address}</p>
                      </div>
                    )}
                    {appointment.user.city && (
                      <div>
                        <p className="text-[#CAC4D0] text-sm mb-1">City</p>
                        <p className="text-[#E6E1E5]">{appointment.user.city}</p>
                      </div>
                    )}
                    {appointment.user.country && (
                      <div>
                        <p className="text-[#CAC4D0] text-sm mb-1">Country</p>
                        <p className="text-[#E6E1E5]">{appointment.user.country}</p>
                      </div>
                    )}
                    {appointment.user.postalCode && (
                      <div>
                        <p className="text-[#CAC4D0] text-sm mb-1">Postal Code</p>
                        <p className="text-[#E6E1E5]">{appointment.user.postalCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 