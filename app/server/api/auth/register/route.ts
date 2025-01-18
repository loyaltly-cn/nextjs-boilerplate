import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { md5 } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { email, password, name ,phoneNumber,dateOfBirth,city,country,postalCode,address ,role} = await request.json()

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

    const user = await prisma.user.create({
      data: {
        email,
        password:md5(password),
        name,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        city,
        country,
        postalCode,
        address,
        role
      }
    })

    return NextResponse.json({
      code: 200,
      message: '注册成功',
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    })
  }
} 