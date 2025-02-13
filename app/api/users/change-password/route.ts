import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { oldPassword, email, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: '用户未找到' }, { status: 404 });
    }
    console.log(user.password);
    console.log(oldPassword);
    

    if (user.password !== oldPassword) {
      return NextResponse.json({ error: '旧密码不正确' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email:email },
      data: { password: newPassword },
    });

    return NextResponse.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('Failed to change password:', error);
    return NextResponse.json({ error: '内部服务器错误' }, { status: 500 });
  }
} 