import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  try {
    

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({
        code: 404,
        message: '邮箱或密码错误'
      })
    }

    if (password !== user.password) {
      return NextResponse.json({
        code: 401,
        message: '邮箱或密码错误'
      })
    }

    return NextResponse.json({
      code: 200,
      message: '登录成功',
      data: user
    })

  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({
      code: 500,
      message: err
    })
  }
} 