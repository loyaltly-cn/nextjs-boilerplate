import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /server/api/view/[id] - 获取单个视图
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const view = await prisma.view.findUnique({
      where: { id }
    })

    if (!view) {
      return NextResponse.json(
        { error: 'View not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(view)
  } catch (error) {
    console.error('Failed to fetch view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /server/api/view/[id] - 更新视图
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const view = await prisma.view.update({
      where: { id },
      data: {
        title: body.title,
        desc: body.desc,
        background: body.background,
        order: body.order,
        isActive: body.isActive
      }
    })

    return NextResponse.json({ success: true, view })
  } catch (error) {
    console.error('Failed to update view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /server/api/view/[id] - 删除视图
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.view.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 