'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Appointment {
  id: string
  name: string
  phone: string
  appointmentTime: string
  createdAt: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch('/api/appointments')
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D0BCFF]"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#1C1B1F] py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal text-[#E6E1E5]">Appointments</h1>
          <button
            onClick={() => router.push('/appointment')}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            New Appointment
          </button>
        </div>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2B2930] rounded-3xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-[#48464C]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#CAC4D0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl text-[#E6E1E5] mb-2">No appointments yet</h3>
            <p className="text-[#CAC4D0]">Create your first appointment to get started.</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#2B2930] rounded-3xl p-6 border border-[#48464C]/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-[#E6E1E5] mb-1">
                      {appointment.name}
                    </h3>
                    <p className="text-[#CAC4D0] text-sm mb-4">
                      {appointment.phone}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-[#D0BCFF]">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">
                          {formatDateTime(appointment.appointmentTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-[#CAC4D0]">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                          Booked {formatDateTime(appointment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-[#F2B8B5] hover:text-[#F2B8B5]/80 transition-colors"
                    onClick={() => {
                      // 添加取消预约的逻辑
                    }}
                    aria-label="Cancel appointment"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 