import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { md5 } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: md5(password),
        name: name || email.split('@')[0],
      }
    })

    return NextResponse.json({
      code: 200,
      message: '注册成功',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 