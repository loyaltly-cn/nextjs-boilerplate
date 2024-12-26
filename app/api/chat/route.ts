import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const response = `I received your message: "${message}". This is a demo response.`
    return NextResponse.json({ message: response })
  } catch (error: unknown) {
    console.error('Error processing message:', error)
    return new NextResponse('Error processing message', { status: 500 })
  }
} 