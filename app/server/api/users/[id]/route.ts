import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取用户信息
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    
    try {
        const { id } = await context.params
        const user = await prisma.user.findUnique({
        where: { id }
        });

        if (!user) {
        return new NextResponse('Not Found', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// 更新用户信息
export async function PUT(
    request: Request, 
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    try {

        const data = await request.json();
        const item = await prisma.user.update({
        where: { id },
        data:{
            ...data,
            ...(data.publishDate && { publishDate: new Date(data.publishDate) })
        }
        });
        return NextResponse.json(item);
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}
