'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  type?: 'date' | 'datetime'
  className?: string
}

export function DateTimePicker({ value, onChange, type = 'date', className }: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date())
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDateSelect = (e: React.MouseEvent, date: Date) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedDate(date)
    onChange(date.toISOString().split('T')[0])
    setShowPicker(false)
  }

  const generateDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const days = generateDays(selectedDate.getFullYear(), selectedDate.getMonth())
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="relative" ref={pickerRef}>
      <input
        type="text"
        value={value ? new Date(value).toLocaleDateString() : ''}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowPicker(true)
        }}
        readOnly
        className={`w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-lg border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] ${className}`}
        placeholder="Select date"
      />

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 p-4 bg-[#2B2930] rounded-lg border border-[#48464C]/30 shadow-lg"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))
                  }}
                  className="p-1 hover:bg-[#48464C]/30 rounded-full"
                  title="Previous Month"
                >
                  <svg className="w-5 h-5 text-[#E6E1E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-[#E6E1E5] font-medium">
                  {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))
                  }}
                  className="p-1 hover:bg-[#48464C]/30 rounded-full"
                  title="Next Month"
                >
                  <svg className="w-5 h-5 text-[#E6E1E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm text-[#CAC4D0] font-medium py-1">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => (
                  <div key={index} className="text-center">
                    {day && (
                      <button
                        onClick={(e) => handleDateSelect(e, new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                        className={`
                          w-8 h-8 rounded-full text-sm font-medium
                          ${selectedDate.getDate() === day
                            ? 'bg-[#D0BCFF] text-[#381E72]'
                            : 'text-[#E6E1E5] hover:bg-[#48464C]/30'
                          }
                        `}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 