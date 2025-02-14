import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, appointmentTime, type, name, phone, email, address, dateOfBirth, answers ,beforeTime,zone} = body

    if (!userId || !appointmentTime) {
      return new NextResponse('Missing required fields', { status: 400 })
    }
    console.log(body);
    
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        type,
        name,
        phone,
        email,
        address,
        dateOfBirth:new Date(dateOfBirth),
        answers,
        appointmentTime: new Date(appointmentTime),
        beforeTime: new Date(beforeTime),
        zone
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Failed to create appointment:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    if (userId) {
      // 获取指定用户的最新预约
      const latestAppointment = await prisma.appointment.findFirst({
        where: { userId: userId },
        orderBy: { appointmentTime: 'desc' },
        include: {
          user: true // 确保包含用户信息
        }
      });

      if (!latestAppointment) {
        return NextResponse.json({ error: 'No appointments found for this user' }, { status: 404 });
      }

      return NextResponse.json({
        code: 200,
        data: latestAppointment
      });
    } else {
      // 获取所有预约
      const appointments = await prisma.appointment.findMany({
        orderBy: {
          appointmentTime: 'desc'
        },
        include: {
          user: true // 确保包含用户信息
        }
      });

      return NextResponse.json({ appointments });
    }
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 


