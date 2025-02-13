//crud

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const comments = await prisma.comments.findMany();
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, content } = await request.json();

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const newComment = await prisma.comments.create({
      data: {
        name: name.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.comments.delete({
      where: { id },
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

//