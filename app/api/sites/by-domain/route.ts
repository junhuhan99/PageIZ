import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostname = searchParams.get('hostname');

    if (!hostname) {
      return NextResponse.json(
        { error: 'Hostname is required' },
        { status: 400 }
      );
    }

    // Find domain in database
    const domain = await prisma.domain.findFirst({
      where: {
        hostname,
        verified: true,
      },
      include: {
        site: {
          include: {
            pages: {
              include: {
                blocks: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ site: domain.site });
  } catch (error) {
    console.error('Get site by domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
