import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const information = await prisma.information.findMany({
      skip,
      take,
    });
    const total = await prisma.information.count();
    return NextResponse.json({ data: information, total });
  } catch (error) {
    console.error('Failed to fetch information:', error);
    return NextResponse.json({ error: 'Failed to fetch information' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, url, type } = await request.json();

    const newInformation = await prisma.information.create({
      data: {
        title,
        content,
        url,
        type,
      },
    });
    return NextResponse.json(newInformation, { status: 201 });
  } catch (error) {
    
    return NextResponse.json({ error: `Failed to create information:${error}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, url, type } = await request.json();

    const updatedInformation = await prisma.information.update({
      where: { id },
      data: {
        title,
        content,
        url,
        type,
      },
    });
    return NextResponse.json(updatedInformation);
  } catch (error) {
    console.error('Failed to update information:', error);
    return NextResponse.json({ error: 'Failed to update information' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.information.delete({
      where: { id },
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('Failed to delete information:', error);
    return NextResponse.json({ error: 'Failed to delete information' }, { status: 500 });
  }
}