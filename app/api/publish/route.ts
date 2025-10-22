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

    // Get all pages for this site
    const pages = await prisma.page.findMany({
      where: { siteId },
    });

    // Create publish records for each page
    const version = Math.floor(Date.now() / 1000);
    const publishes = await Promise.all(
      pages.map((page) =>
        prisma.publish.create({
          data: {
            pageId: page.id,
            url: `https://pageiz.me/${page.slug}`,
            version,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      publishes,
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
