import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /server/api/view - 获取所有视图
export async function GET() {
  try {
    const views = await prisma.view.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json({ items: views })
  } catch (error) {
    console.error('Failed to fetch views:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /server/api/view - 创建新视图
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
    if (!body.title || !body.desc || !body.background) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const view = await prisma.view.create({
      data: {
        title: body.title,
        desc: body.desc,
        background: body.background,
        order: body.order || 0,
        isActive: body.isActive ?? true
      }
    })

    return NextResponse.json({ success: true, view })
  } catch (error) {
    console.error('Failed to create view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 