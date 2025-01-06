import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 创建
export async function POST(request: Request) {
  try {
    const { text, options } = await request.json()

    if (!text || !options || !Array.isArray(options)) {
      return NextResponse.json({
        code: 400,
        message: 'Invalid parameters'
      })
    }

    const appointmentOption = await prisma.appointmentOption.create({
      data: { text, options }
    })

    return NextResponse.json({
      code: 200,
      message: 'Created successfully',
      data: appointmentOption
    })
  } catch (err) {
    console.error('Create error:', err)
    return NextResponse.json({
      code: 500,
      message: 'Server error'
    })
  }
}

// 获取列表
export async function GET() {
  try {
    const appointmentOptions = await prisma.appointmentOption.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      code: 200,
      data: appointmentOptions
    })
  } catch (err) {
    console.error('Query error:', err)
    return NextResponse.json({
      code: 500,
      message: 'Server error'
    })
  }
} 