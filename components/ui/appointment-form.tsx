'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DateTimePicker } from './date-time-picker'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

interface AppointmentFormData {
  name: string
  phone: string
  date: string
  time: string
}

export function AppointmentForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    phone: '',
    date: '',
    time: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      router.push('/appointment/success')
    } catch (error) {
      setIsLoading(false)
      toast(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
        'error'
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="bg-gradient-to-b from-[#2B2930] to-[#1C1B1F] rounded-3xl shadow-xl overflow-hidden border border-[#48464C]/30">
        {/* Header */}
        <div className="px-8 py-6 bg-[#D0BCFF]/10 border-b border-[#48464C]/30">
          <h2 className="text-2xl font-semibold text-[#E6E1E5]">Book an Appointment</h2>
          <p className="mt-2 text-[#CAC4D0]">Fill in the form below to schedule your appointment</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-[#48464C]/30 text-[#E6E1E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] placeholder-[#CAC4D0]/50 transition-all duration-200"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#CAC4D0] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                pattern="[0-9]{11}"
                className="w-full px-4 py-3 bg-[#48464C]/30 text-[#E6E1E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] placeholder-[#CAC4D0]/50 transition-all duration-200"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateTimePicker
              type="date"
              label="Appointment Date"
              value={formData.date}
              onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
            />

            <DateTimePicker
              type="time"
              label="Appointment Time"
              value={formData.time}
              onChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-[#D0BCFF] text-[#381E72] rounded-xl font-medium hover:bg-[#E8DEF8] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#D0BCFF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#381E72]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Book Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
} 