import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { md5 } from '@/lib/utils'
import { sendEmail } from '@/lib/smtp'

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const { email, password, name, phoneNumber, dateOfBirth, city, country, postalCode, address, role } = body

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
    sendEmail({ to: email, subject: '注册成功', text: '', html: '欢迎注册我们的服务！' });

    const user = await prisma.user.create({
      data: {
        email,
        password: password,
        username:name,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        city,
        country,
        postalCode,
        address,
        role
      }
    })

    await sendEmail({ to: user.email, subject: '注册成功', text: '', html: '欢迎注册我们的服务！' });

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