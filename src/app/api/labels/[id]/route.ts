import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { updateLabelSchema } from '@/lib/validations';

async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return decoded.userId;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const label = await db.label.findFirst({
      where: {
        id: params.id,
        userId
      },
      include: {
        taskLabels: {
          include: {
            task: true
          }
        }
      }
    });

    if (!label) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(label);
  } catch (error) {
    console.error('Get label error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color } = updateLabelSchema.parse(body);

    const label = await db.label.updateMany({
      where: {
        id: params.id,
        userId
      },
      data: {
        name,
        color
      }
    });

    if (label.count === 0) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }

    const updatedLabel = await db.label.findUnique({
      where: { id: params.id }
    });

    return NextResponse.json(updatedLabel);
  } catch (error) {
    console.error('Update label error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const label = await db.label.deleteMany({
      where: {
        id: params.id,
        userId
      }
    });

    if (label.count === 0) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Delete label error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}