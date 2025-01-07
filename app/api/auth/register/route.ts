import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log(body);
    
    const { email, password, name ,phoneNumber,dateOfBirth,city,country,postalCode,address} = body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({
        code: 400,
        message: 'Email already exists'
      })
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        city,
        country,
        postalCode,
        address
      }
    })

    return NextResponse.json({
      code: 200,
      message: 'User created successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      code: 500,
      message: 'Server error'
    })
  }
} 