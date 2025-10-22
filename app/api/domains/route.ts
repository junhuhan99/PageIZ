import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

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

    const domains = await prisma.domain.findMany({
      where: { siteId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ domains });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get domains error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { siteId, domain, type = 'custom' } = body;

    if (!siteId || !domain) {
      return NextResponse.json(
        { error: '사이트 ID와 도메인이 필요합니다' },
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

    // Check if domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: { domain },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: '이미 사용 중인 도메인입니다' },
        { status: 400 }
      );
    }

    const newDomain = await prisma.domain.create({
      data: {
        siteId,
        domain,
        type,
        verified: type === 'subdomain', // Auto-verify subdomains
      },
    });

    return NextResponse.json({ domain: newDomain });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '도메인 ID가 필요합니다' },
        { status: 400 }
      );
    }

    // Verify domain ownership through site
    const domain = await prisma.domain.findUnique({
      where: { id },
      include: { site: true },
    });

    if (!domain || domain.site.userId !== user.userId) {
      return NextResponse.json(
        { error: '도메인을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    await prisma.domain.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
