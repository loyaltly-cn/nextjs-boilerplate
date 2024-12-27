'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import type { Chat } from '@/demo_model'

export default function ChatRoom({ chat: initialChat }: { chat: Chat }) {
  const [chat, setChat] = useState(initialChat)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pollInterval = useRef<NodeJS.Timeout | undefined>(undefined)

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 轮询新消息
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/server/api/chat/${chat.id}/messages`)
      const messages = await res.json()
      if (messages.length > chat.messages.length) {
        setChat(prev => ({ ...prev, messages }))
        scrollToBottom()
      }
    }

    if (chat.status === 'OPEN') {
      pollInterval.current = setInterval(fetchMessages, 3000)
    }

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
      }
    }
  }, [chat.id, chat.status, chat.messages.length])

  // 发送消息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || chat.status !== 'OPEN') return

    setIsLoading(true)
    try {
      const res = await fetch(`/server/api/chat/${chat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      })
      const newMessage = await res.json()
      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }))
      setInput('')
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#1C1B1F]">
      {/* Sticky Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#48464C]/30 bg-[#2B2930]">
        <div>
          <h1 className="text-xl font-semibold text-[#E6E1E5]">
            Chat with {chat.userName}
          </h1>
          <p className="text-[#CAC4D0] text-sm">
            {chat.status === 'OPEN' ? 'Active' : 'Closed'}
          </p>
        </div>
        <button
          onClick={() => router.push('/chats')}
          title="Close chat"
          className="p-2 rounded-lg text-[#CAC4D0] hover:bg-[#48464C]/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col max-w-[80%] space-y-1">
              <div
                className={`rounded-xl px-4 py-2 ${
                  message.role === 'ADMIN'
                    ? 'bg-[#D0BCFF] text-[#381E72]'
                    : 'bg-[#48464C]/30 text-[#E6E1E5]'
                }`}
              >
                {message.content}
              </div>
              <span className="text-[#CAC4D0] text-xs px-2">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: enUS
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Input */}
      <div className="border-t border-[#48464C]/30 bg-[#2B2930]">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chat.status === 'OPEN' ? "Type a message..." : "Chat is closed"}
              disabled={chat.status !== 'OPEN'}
              className="flex-1 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || chat.status !== 'OPEN'}
              className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 