'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import type { Chat } from '@/demo_model'

export default function ChatList({ chats }: { chats: Chat[] }) {
  const router = useRouter()

  return (
    <div className="grid gap-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => router.push(`/chats/${chat.id}`)}
          className="bg-[#2B2930] rounded-xl border border-[#48464C]/30 p-4 cursor-pointer hover:bg-[#48464C]/30 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#E6E1E5] font-medium">{chat.userName}</h3>
              <p className="text-[#CAC4D0] text-sm mt-1">
                {chat.messages[0]?.content || 'No messages'}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 rounded-full text-xs ${
                chat.status === 'OPEN' 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {chat.status === 'OPEN' ? 'Active' : 'Closed'}
              </span>
              <span className="text-[#CAC4D0] text-xs mt-2">
                {formatDistanceToNow(new Date(chat.updatedAt), {
                  addSuffix: true,
                  locale: enUS
                })}
              </span>
            </div>
          </div>
        </div>
      ))}

      {chats.length === 0 && (
        <div className="text-center py-12 text-[#CAC4D0]">
          No chat records
        </div>
      )}
    </div>
  )
} 