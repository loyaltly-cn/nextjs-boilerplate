// ---
// 实现aboutVido crud接口

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取所有视频
export async function GET() {
  try {
    const aboutVideos = await prisma.aboutVideo.findMany();
    return NextResponse.json(aboutVideos);
  } catch (error) {
    console.error('Failed to fetch about videos:', error);
    return NextResponse.json({ error: 'Failed to fetch about videos' }, { status: 500 });
  }
}

// 创建新视频
export async function POST(request: Request) {
  try {
    const { url, userId } = await request.json();

    if (!url || !userId) {
      return NextResponse.json({ error: 'URL and userId are required' }, { status: 400 });
    }

    const newVideo = await prisma.aboutVideo.create({
      data: {
        url,
        userId,
      },
    });

    return NextResponse.json(newVideo, { status: 200 });
  } catch (error) {
    // console.error('Failed to create about video:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// 更新视频
export async function PUT(request: Request) {
  try {
    const { id, url } = await request.json();

    if (!id || !url) {
      return NextResponse.json({ error: 'ID and URL are required' }, { status: 400 });
    }

    const updatedVideo = await prisma.aboutVideo.update({
      where: { id },
      data: { url },
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error('Failed to update about video:', error);
    return NextResponse.json({ error: 'Failed to update about video' }, { status: 500 });
  }
}

// 删除视频
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
    console.log(id);
    
  if (!id) { 
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.aboutVideo.delete({
      where: { id },
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('Failed to delete about video:', error);
    return NextResponse.json({ error: 'Failed to delete about video' }, { status: 500 });
  }
}