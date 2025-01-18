import { type Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ChatRoom from './chat-room'

interface Chat {
  id: string;
  userId: string | null;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const chat = await prisma.chat.findUnique({
    where: { id: id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!chat) {
    redirect('/chats')
  }

  return <ChatRoom chat={chat} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Chat ${id}`
  }
} 