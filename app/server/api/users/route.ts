import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { md5 } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // 验证输入
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
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

    // 使用 md5 加密密码
    const hashedPassword = md5(password)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        isAdmin: false
      }
    })

    // 不返回密码
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 