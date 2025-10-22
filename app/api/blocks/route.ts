import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { pageId, type, payload, order } = body;

    if (!pageId || !type) {
      return NextResponse.json(
        { error: 'pageId and type are required' },
        { status: 400 }
      );
    }

    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        site: {
          userId: user.userId,
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    let blockOrder = order;
    if (blockOrder === undefined) {
      const lastBlock = await prisma.block.findFirst({
        where: { pageId },
        orderBy: { order: 'desc' },
      });
      blockOrder = (lastBlock?.order ?? -1) + 1;
    }

    const block = await prisma.block.create({
      data: {
        pageId,
        type,
        payload: payload || {},
        order: blockOrder,
      },
    });

    return NextResponse.json({ block });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create block error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { id, payload, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const block = await prisma.block.findFirst({
      where: {
        id,
        page: {
          site: {
            userId: user.userId,
          },
        },
      },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const updatedBlock = await prisma.block.update({
      where: { id },
      data: {
        ...(payload !== undefined && { payload }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ block: updatedBlock });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update block error:', error);
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
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const block = await prisma.block.findFirst({
      where: {
        id,
        page: {
          site: {
            userId: user.userId,
          },
        },
      },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    await prisma.block.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete block error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
