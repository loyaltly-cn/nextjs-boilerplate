import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp';

export async function POST(request) {
  const { to, subject, text, html } = await request.json();

  try {
    await sendEmail({ to, subject, text, html });
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to send email', error });
  }
} 