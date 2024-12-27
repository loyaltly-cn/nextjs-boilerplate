'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  content: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

interface Chat {
  id: string
  userName: string
  status: 'OPEN' | 'CLOSED'
  messages: Message[]
}

export function ChatAssistant() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 获取聊天列表
  useEffect(() => {
    if (session && isOpen) {
      fetch('/server/api/chat')
        .then(async res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          const text = await res.text() // 先获取响应文本
          try {
            const data = JSON.parse(text) // 尝试解析 JSON
            if (Array.isArray(data)) {
              setChats(data)
            } else {
              console.error('Expected array of chats but got:', data)
              setChats([])
            }
          } catch (e) {
            console.error('Failed to parse JSON:', text)
            setChats([])
          }
        })
        .catch(error => {
          console.error('Failed to fetch chats:', error)
          setChats([])
        })
    }
  }, [session, isOpen])

  // 获取选中聊天的消息
  useEffect(() => {
    if (selectedChat) {
      fetch(`/server/api/chat/${selectedChat}/messages`)
        .then(async res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          const text = await res.text()
          try {
            const data = JSON.parse(text)
            if (Array.isArray(data)) {
              setMessages(data)
            } else {
              console.error('Expected array of messages but got:', data)
              setMessages([])
            }
          } catch (e) {
            console.error('Failed to parse JSON:', text)
            setMessages([])
          }
        })
        .catch(error => {
          console.error('Failed to fetch messages:', error)
          setMessages([])
        })
    }
  }, [selectedChat])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch(`/server/api/chat/${selectedChat}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      })
      const newMessage = await res.json()
      setMessages(prev => [...prev, newMessage])
      setInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        aria-label="Open chat"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#D0BCFF] text-[#381E72] flex items-center justify-center shadow-lg hover:bg-[#E8DEF8] transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-8 w-96 h-[600px] bg-[#2B2930] rounded-xl shadow-xl border border-[#48464C]/30 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#48464C]/30 flex justify-between items-center">
              <h3 className="text-[#E6E1E5] font-medium">
                {selectedChat ? 'Chat' : 'Customer Service'}
              </h3>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => {
                  setIsOpen(false)
                  setSelectedChat(null)
                }}
                className="text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedChat ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-2 ${
                          message.role === 'USER'
                            ? 'bg-[#D0BCFF] text-[#381E72]'
                            : 'bg-[#48464C]/30 text-[#E6E1E5]'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-[#48464C]/30">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Chat List */
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chats.map((chat) => (
                  <button
                    type="button"
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className="w-full p-4 bg-[#1C1B1F] rounded-xl hover:bg-[#48464C]/30 transition-colors text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[#E6E1E5] font-medium">{chat.userName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        chat.status === 'OPEN' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {chat.status}
                      </span>
                    </div>
                    {chat.messages[0] && (
                      <p className="text-[#CAC4D0] text-sm mt-2 truncate">
                        {chat.messages[0].content}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 