import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 创建代孕申请
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      name,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      email,
      dateOfBirth,
      partnerName,
      partnerDateOfBirth,
      answers
    } = body

    // 验证必填字段
    if (!userId || !answers?.length) {
      return NextResponse.json({
        code: 400,
        message: 'Missing required fields'
      })
    }

    // 创建申请
    const application = await prisma.surrogacyApplication.create({
      data: {
        userId,
        name,
        address,
        city,
        state,
        postalCode,
        country,
        phone,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        partnerName,
        partnerDateOfBirth: partnerDateOfBirth ? new Date(partnerDateOfBirth) : null,
        answers
      }
    })

    return NextResponse.json({
      code: 200,
      message: 'Application submitted successfully',
      data: application
    })
  } catch (error) {
    console.error('Create application error:', error)
    return NextResponse.json({
      code: 500,
      message: 'Server error'
    })
  }
}

// 获取代孕申请列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const applications = await prisma.surrogacyApplication.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      code: 200,
      data: applications
    })
  } catch (error) {
    console.error('Query applications error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({
      code: 500,
      message: 'Server error'
    })
  }
} 