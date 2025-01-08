import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 查询所有代孕母申请
export async function GET() {
  try {
    const applications = await prisma.surrogateMotherApplication.findMany();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 添加代孕母申请
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.userId) {
      return NextResponse.json({
        status: 400,
        message: 'User ID is required'
      });
    }

    const applicationData = {
      userId: data.userId,
      name: data.name,
      age: data.age,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      ethnicity: data.ethnicity,
      education: data.education,
      maritalStatus: data.maritalStatus,
      hasChildren: data.hasChildren,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phoneNumber: data.phoneNumber,
      email: data.email
    };

    const application = await prisma.surrogateMotherApplication.create({
      data: applicationData
    });

    return NextResponse.json(application);
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      status: 500,
      message: error
    });
  }
}