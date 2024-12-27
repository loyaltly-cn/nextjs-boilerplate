import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const videos = await prisma.aboutVideo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ items: videos })
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    // 验证请求体
    if (!body?.url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    // 验证用户ID
    if (!session.user.id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Creating video with data:', {
      url: body.url,
      userId: session.user.id
    })

    // 创建视频记录
    const video = await prisma.aboutVideo.create({
      data: {
        url: body.url,
        userId: session.user.id
      }
    })

    console.log('Video created:', video)

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error('Failed to create video:', error)
    // 添加更详细的错误信息
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : 'Unknown error occurred'
    
    console.error('Detailed error:', errorMessage)

    return new NextResponse(
      JSON.stringify({
        error: errorMessage
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 