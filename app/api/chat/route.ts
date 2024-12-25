import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // 这里可以接入实际的 AI 服务
    // 目前返回简单的回复
    const response = `I received your message: "${message}". This is a demo response.`

    return NextResponse.json({ message: response })
  } catch (error) {
    return new NextResponse('Error processing message', { status: 500 })
  }
} 