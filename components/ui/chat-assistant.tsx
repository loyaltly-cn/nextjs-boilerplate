'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getDefaultAvatar } from './avatar'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatAssistant() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        timestamp: new Date()
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div ref={chatRef} className="w-[400px] h-[600px] bg-gradient-to-b from-[#1C1B1F] to-[#2B2930] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out] border border-[#48464C]/30">
          {/* Header */}
          <div className="px-6 py-4 bg-[#1C1B1F]/50 backdrop-blur-xl border-b border-[#48464C]/30 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#D0BCFF] animate-pulse" />
              <h3 className="text-[#E6E1E5] font-medium">AI Assistant</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors p-2 hover:bg-[#48464C]/30 rounded-full"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#48464C]/50
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:border-2
            [&::-webkit-scrollbar-thumb]:border-solid
            [&::-webkit-scrollbar-thumb]:border-transparent
            [&::-webkit-scrollbar-thumb]:bg-clip-padding
            hover:[&::-webkit-scrollbar-thumb]:bg-[#48464C]/80">
            {messages.length === 0 && (
              <div className="text-center text-[#CAC4D0] text-sm py-8">
                How can I assist you today?
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
              >
                {message.role === 'assistant' && (
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#D0BCFF] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[#CAC4D0] text-xs">AI</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`inline-block max-w-[80%] px-4 py-2 whitespace-pre-wrap break-words ${
                      message.role === 'user'
                        ? 'bg-[#D0BCFF] text-[#381E72] rounded-2xl rounded-br-none'
                        : 'bg-[#48464C]/50 text-[#E6E1E5] rounded-2xl rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                  <span className={`text-[#CAC4D0] text-[10px] mt-0.5 opacity-80 ${
                    message.role === 'user' ? 'text-right mr-2' : 'text-left ml-2'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#D0BCFF]">
                      <Image
                        src={session?.user?.image || getDefaultAvatar(session?.user?.email)}
                        alt="User"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[#CAC4D0] text-xs">
                      {session?.user?.name || 'Me'}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end space-x-2">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-[#D0BCFF] flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#381E72] rounded-full animate-pulse" />
                  </div>
                  <span className="text-[#CAC4D0] text-xs">AI</span>
                </div>
                <div className="bg-[#48464C]/50 rounded-2xl px-4 py-2 text-[#E6E1E5] rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#CAC4D0] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#CAC4D0] rounded-full animate-bounce delay-200" />
                    <div className="w-2 h-2 bg-[#CAC4D0] rounded-full animate-bounce delay-400" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-[#1C1B1F]/50 backdrop-blur-xl border-t border-[#48464C]/30">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-[#48464C]/50 text-[#E6E1E5] rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] placeholder-[#CAC4D0]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#D0BCFF] hover:text-[#E8DEF8] disabled:opacity-50 disabled:hover:text-[#D0BCFF]"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#D0BCFF] rounded-full shadow-lg flex items-center justify-center hover:bg-[#E8DEF8] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open chat assistant"
        >
          <svg className="w-6 h-6 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  )
} 