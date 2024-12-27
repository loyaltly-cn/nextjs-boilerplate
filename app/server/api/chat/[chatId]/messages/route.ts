import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 发送消息
export async function POST(
  request: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await context.params
  try {
    // 验证聊天是否存在
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // 检查聊天是否已关闭
    if (chat.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Chat is closed' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        role: session ? 'ADMIN' : 'USER',
        chatId
      }
    })

    // 更新聊天的更新时间
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Failed to create message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 获取消息列表
export async function GET(
  request: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await context.params
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 