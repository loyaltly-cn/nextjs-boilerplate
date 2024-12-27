import { NextResponse } from 'next/server'

interface ErrorResponse {
  error: string
}

interface SuccessResponse {
  msg: string
  data?: unknown
}

/**
 * @swagger
 * /server/api/test:
 *   get:
 *     summary: Test endpoint
 *     description: Returns a test message
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
export async function GET() {
  try {
    return NextResponse.json<SuccessResponse>({ msg: "test" })
  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /server/api/test:
 *   post:
 *     summary: Test POST endpoint
 *     description: Returns the posted data with a test message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json<SuccessResponse>({ msg: "test", data: body })
}

export async function PUT(request: Request) {
  const body = await request.json()
  return NextResponse.json<SuccessResponse>({ msg: "test", data: body })
}

export async function DELETE() {
  return NextResponse.json<SuccessResponse>({ msg: "test deleted" })
} 