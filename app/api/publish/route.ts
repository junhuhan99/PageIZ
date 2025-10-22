import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { siteId } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: '사이트 ID가 필요합니다' },
        { status: 400 }
      );
    }

    // Verify site ownership
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId: user.userId,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: '사이트를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Update site status to published
    await prisma.site.update({
      where: { id: siteId },
      data: { status: 'published' },
    });

    // Create publish record
    const publish = await prisma.publish.create({
      data: {
        siteId,
        version: new Date().getTime().toString(),
        status: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      publish,
      message: '사이트가 성공적으로 배포되었습니다!',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: '배포 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
