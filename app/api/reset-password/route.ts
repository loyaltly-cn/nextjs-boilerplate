import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { md5 } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { email, newPassword, token } = await request.json()

    // 验证 token
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!passwordReset || passwordReset.expires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // 更新密码
    await prisma.user.update({
      where: { email },
      data: { password: md5(newPassword) },
    })

    // 删除已使用的 token
    await prisma.passwordReset.delete({
      where: { token },
    })

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
} 