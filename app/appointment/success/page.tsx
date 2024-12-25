'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AppointmentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#1C1B1F] py-32">
      <div className="max-w-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-[#2B2930] to-[#1C1B1F] rounded-3xl shadow-xl overflow-hidden border border-[#48464C]/30 p-8 text-center"
        >
          <div className="w-16 h-16 bg-[#D0BCFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-[#E6E1E5] mb-4">
            Appointment Booked Successfully!
          </h1>
          
          <p className="text-[#CAC4D0] mb-8">
            Thank you for your booking. We will contact you shortly to confirm your appointment.
          </p>

          <div className="space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium text-[#E6E1E5] bg-[#48464C]/30 hover:bg-[#48464C]/50 transition-all duration-200"
            >
              Return Home
            </Link>
            <Link
              href="/appointment"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-all duration-200"
            >
              Book Another
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 