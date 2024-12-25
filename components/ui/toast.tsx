'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const icons = {
  info: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  success: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),
}

const colors = {
  info: 'bg-[#1C1B1F]/90 text-[#E6E1E5]',
  success: 'bg-[#1B4B2C]/90 text-[#A6F4C5]',
  warning: 'bg-[#4A2800]/90 text-[#FFB686]',
  error: 'bg-[#31111D]/90 text-[#F2B8B5]',
}

let toastId = 0
const toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

function emit() {
  listeners.forEach(listener => listener([...toasts]))
}

export function toast(message: string, type: Toast['type'] = 'info') {
  const id = ++toastId
  toasts.push({ id, message, type })
  emit()

  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
      emit()
    }
  }, 3000)
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    function handleToasts(newToasts: Toast[]) {
      setCurrentToasts(newToasts)
    }
    
    listeners.push(handleToasts)
    return () => {
      listeners = listeners.filter(listener => listener !== handleToasts)
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${colors[toast.type]}
            backdrop-blur-sm
            px-4 py-3 rounded-lg
            flex items-center space-x-2
            shadow-lg
            min-w-[120px] max-w-[300px]
            select-none
            animate-[toastIn_0.3s_ease-out]
          `}
        >
          <span className="flex-shrink-0">{icons[toast.type]}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>,
    document.body
  )
} 