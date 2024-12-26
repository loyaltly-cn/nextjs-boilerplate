import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('avatar') as File
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    const fileName = `avatars/${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}`
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: blob.url },
    })

    return NextResponse.json({ avatarUrl: blob.url })
  } catch (error: unknown) {
    console.error('Error uploading avatar:', error)
    return new NextResponse('Error uploading avatar', { status: 500 })
  }
} 