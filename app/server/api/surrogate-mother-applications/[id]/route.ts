import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 根据 ID 查询代孕母申请
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
  try {
    const application = await prisma.surrogateMotherApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Failed to fetch application:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 删除代孕母申请
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
  try {
    await prisma.surrogateMotherApplication.delete({
      where: { id }
    });

    return new NextResponse('Application deleted', { status: 200 });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}