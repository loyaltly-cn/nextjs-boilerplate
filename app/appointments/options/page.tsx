'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface AppointmentOption {
  id: string
  text: string
  options: string[]
  createdAt: string
  updatedAt: string
}

export default function AppointmentOptionsPage() {
  const [options, setOptions] = useState<AppointmentOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newOption, setNewOption] = useState({ text: '', options: [''] })

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/appointment-options')
      const data = await response.json()
      if (data.code === 200) {
        setOptions(data.data)
      }
    } catch (error) {
      toast('Failed to fetch options', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = async () => {
    try {
      const response = await fetch('/api/appointment-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newOption.text,
          options: newOption.options.filter(Boolean)
        })
      })

      const data = await response.json()
      if (data.code === 200) {
        toast('Option added successfully', 'success')
        setOptions([data.data, ...options])
        setShowAddDialog(false)
        setNewOption({ text: '', options: [''] })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'Failed to add option',
        'error'
      )
    }
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#E6E1E5]">Appointment Options</h1>
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-6 py-2.5 bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] rounded-full font-medium transition-colors"
        >
          Add Option
        </button>
      </div>
      
      <div className="grid gap-6">
        {options.map(option => (
          <div 
            key={option.id} 
            className="bg-[#2B2930] p-6 rounded-3xl border border-[#48464C]/30"
          >
            <h3 className="text-[#CAC4D0] text-lg font-medium mb-4">{option.text}</h3>
            <div className="flex flex-wrap gap-2">
              {option.options.map((item, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#48464C]/30 text-[#E6E1E5] rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2B2930] rounded-3xl p-6 max-w-md w-full animate-[slideUp_0.2s_ease-out]">
            <h3 className="text-xl font-normal text-[#E6E1E5] mb-4">
              Add Appointment Option
            </h3>
            <p className="text-[#CAC4D0] mb-6">
              Add a new appointment option with multiple choices
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                  Option Text
                </label>
                <input
                  type="text"
                  value={newOption.text}
                  onChange={e => setNewOption(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                  placeholder="Enter option text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CAC4D0] mb-2">
                  Available Options
                </label>
                <div className="space-y-2">
                  {newOption.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={e => {
                          const newOptions = [...newOption.options]
                          newOptions[index] = e.target.value
                          setNewOption(prev => ({ ...prev, options: newOptions }))
                        }}
                        className="flex-1 px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                        placeholder={`Option ${index + 1}`}
                      />
                      {index === newOption.options.length - 1 ? (
                        <button
                          onClick={() => setNewOption(prev => ({ ...prev, options: [...prev.options, ''] }))}
                          className="p-2 text-[#D0BCFF] hover:bg-[#48464C]/30 rounded-xl transition-colors"
                          title="Add option"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const newOptions = newOption.options.filter((_, i) => i !== index)
                            setNewOption(prev => ({ ...prev, options: newOptions }))
                          }}
                          className="p-2 text-[#F2B8B5] hover:bg-[#48464C]/30 rounded-xl transition-colors"
                          title="Remove option"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowAddDialog(false)
                  setNewOption({ text: '', options: [''] })
                }}
                className="px-4 py-2 rounded-full text-[#E6E1E5] hover:bg-[#48464C] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOption}
                className="px-4 py-2 rounded-full text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 