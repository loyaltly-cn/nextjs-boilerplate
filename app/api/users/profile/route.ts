import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name } = await req.json()
    if (!name?.trim()) {
      return new NextResponse('Name is required', { status: 400 })
    }

    // 更新数据库中的用户名称
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    })

    return new NextResponse('Profile updated')
  } catch (error) {
    console.error('Error updating profile:', error)
    return new NextResponse('Error updating profile', { status: 500 })
  }
} 