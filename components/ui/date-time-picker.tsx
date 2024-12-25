'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  type: 'date' | 'time'
  label: string
}

export function DateTimePicker({ value, onChange, type, label }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX
        })
      }
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: string) => {
    if (!date) return type === 'date' ? 'Select date' : 'Select time'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return 'Select time'
    return time
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const days = []
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isSelected = (date: Date) => {
    return value === date.toISOString().split('T')[0]
  }

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="w-full px-4 py-3 bg-[#48464C]/30 text-[#E6E1E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] text-left flex items-center space-x-3 hover:bg-[#48464C]/40 transition-all duration-200"
      >
        <span className={`flex-1 ${!value ? 'text-[#CAC4D0]' : ''}`}>
          {type === 'date' ? formatDate(value) : formatTime(value)}
        </span>
        <svg className="w-5 h-5 text-[#CAC4D0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {type === 'date' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: 50
            }}
            className="w-[320px] bg-[#2B2930] rounded-xl shadow-xl border border-[#48464C]/30 overflow-hidden"
          >
            {type === 'date' ? (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-1 hover:bg-[#48464C]/30 rounded-lg transition-colors"
                    aria-label="Previous month"
                  >
                    <svg className="w-5 h-5 text-[#CAC4D0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-[#E6E1E5] font-medium">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-1 hover:bg-[#48464C]/30 rounded-lg transition-colors"
                    aria-label="Next month"
                  >
                    <svg className="w-5 h-5 text-[#CAC4D0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[#CAC4D0] text-xs text-center py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => (
                    <div key={index} className="aspect-square">
                      {date && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onChange(date.toISOString().split('T')[0])
                            setIsOpen(false)
                          }}
                          disabled={isPast(date)}
                          className={`
                            w-full h-full rounded-lg text-sm
                            ${isSelected(date) ? 'bg-[#D0BCFF] text-[#381E72]' : 'text-[#E6E1E5]'}
                            ${isToday(date) ? 'ring-2 ring-[#D0BCFF]' : ''}
                            ${isPast(date) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#D0BCFF]/20'}
                            transition-all duration-200
                          `}
                        >
                          {date.getDate()}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onChange(time)
                        setIsOpen(false)
                      }}
                      className={`
                        px-3 py-2 rounded-lg text-[#E6E1E5] 
                        ${value === time ? 'bg-[#D0BCFF] text-[#381E72]' : 'hover:bg-[#D0BCFF]/20'}
                        focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] 
                        transition-all duration-200
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 