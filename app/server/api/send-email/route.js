import { NextResponse } from 'next/server';
import { sendcode } from '@/lib/smtp';

function generateCaptcha() {
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    captcha += Math.floor(Math.random() * 10); // 生成一个 0 到 9 之间的随机整数
  }
  return captcha;
}

export async function POST(request) {
  const { to, subject, text, html } = await request.json();
  const code = generateCaptcha();
  try {
    await sendcode({ to, subject, text: '', html: code });
    return NextResponse.json({ success: true, message: 'Email sent successfully', code });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ success: false, message: 'Failed to send email', error });
  }
} 