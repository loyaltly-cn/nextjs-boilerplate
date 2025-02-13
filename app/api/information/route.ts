import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 更新信息
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Information ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, content, url, type } = body;

    const updatedInformation = await prisma.information.update({
      where: { id: id },
      data: {
        title,
        content,
        url,
        type,
      },
    });

    return NextResponse.json({
      code: 200,
      message: 'Information updated successfully',
      data: updatedInformation,
    });
  } catch (error) {
    console.error('Failed to update information:', error);
    return NextResponse.json({ error: 'Failed to update information' }, { status: 500 });
  }
}

// 删除信息
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Information ID is required' }, { status: 400 });
  }

  try {
    await prisma.information.delete({
      where: { id: id },
    });

    return NextResponse.json({
      code: 200,
      message: 'Information deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete information:', error);
    return NextResponse.json({ error: 'Failed to delete information' }, { status: 500 });
  }
}