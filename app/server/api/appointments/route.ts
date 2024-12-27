import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, appointmentTime } = body

    if (!name || !phone || !appointmentTime) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        appointmentTime: new Date(appointmentTime)
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to create appointment:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        appointmentTime: 'desc'
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 