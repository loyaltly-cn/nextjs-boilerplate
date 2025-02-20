import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const { email, password,} = body

    if (!email || !password) {
      return NextResponse.json({
        code: 400,
        message: '邮箱和密码不能为空'
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({
        code: 409,
        message: '邮箱已存在'
      })
    }

    console.log(body);
    
    const user = await prisma.user.create({
      data: body
    })

    fetch('/api/welcome-email', {
      method: 'POST',
      body: JSON.stringify({
        email: user.email,
        name: user.username
      })
    })


    return NextResponse.json({
      code: 200,
      message: '注册成功',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({
      code: 500,
      message: JSON.stringify(err)
    })
  }
} 