import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 创建预约
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uid, date ,type} = body

    if (!uid || !date) {
      return new NextResponse(
        JSON.stringify({
          code: 400,
          message: 'Invalid parameters'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: uid }
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          code: 404,
          message: 'User not found'
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: uid,
        type,
        appointmentTime: new Date(date)
      }
    })

    return new NextResponse(
      JSON.stringify({
        code: 200,
        message: 'Created successfully',
        data: appointment
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        code: 500,
        message: 'Server error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// 获取预约列表
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            dateOfBirth: true,
            address: true,
            city: true,
            country: true,
            postalCode: true
          }
        }
      },
      orderBy: {
        appointmentTime: 'desc'
      }
    })

    return NextResponse.json({
      code: 200,
      data: appointments
    })
  } catch (error) {
    console.error('Query appointments error:', error)
    return NextResponse.json({
      code: 500,
      message: 'Server error'
    })
  }
} 