import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 创建新的聊天会话
export async function POST(request: Request) {
  try {
    const { userName, message } = await request.json()
    
    const chat = await prisma.chat.create({
      data: {
        userName,
        messages: {
          create: {
            content: message,
            role: 'USER'
          }
        }
      },
      include: {
        messages: true
      }
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Failed to create chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 获取聊天列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json([])
    }

    const chats = await prisma.chat.findMany({
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    }).catch(e => {
      console.error('Database error:', e)
      throw e
    })

    return NextResponse.json(chats || [])
  } catch (error) {
    const session = await getServerSession(authOptions).catch(() => null)
    console.error('Failed to fetch chats:', {
      error,
      session: !!session,
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json([])
  }
} 