import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { del } from '@vercel/blob'

// 获取单个项目详情
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const item = await prisma.aboutItem.findUnique({
      where: { id }
    })

    if (!item || !item.isActive) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Failed to fetch about item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新项目（需要管理员权限）
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

    const data = await request.json()
    
    const item = await prisma.aboutItem.update({
      where: { id },
      data: {
        ...data,
        ...(data.publishDate && { publishDate: new Date(data.publishDate) })
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Failed to update about item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 删除项目（需要管理员权限）
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取项目信息
    const item = await prisma.aboutItem.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    try {
      // 删除 Blob Storage 中的图片
      await del(item.imageUrl)
    } catch (error) {
      console.error('Failed to delete image:', error)
      // 继续删除数据库记录，即使图片删除失败
    }

    // 删除数据库记录
    await prisma.aboutItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
} 