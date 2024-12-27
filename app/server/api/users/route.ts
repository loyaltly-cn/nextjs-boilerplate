import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { md5 } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    // 验证输入
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: email.trim(),
        password: md5(password),
        isAdmin: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 