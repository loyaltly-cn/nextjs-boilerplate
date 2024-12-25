import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ msg: "test" })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// POST 请求处理
export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ msg: "test", data: body })
}

// PUT 请求处理
export async function PUT(request: Request) {
  const body = await request.json()
  return NextResponse.json({ msg: "test", data: body })
}

// DELETE 请求处理
export async function DELETE() {
  return NextResponse.json({ msg: "test deleted" })
} 