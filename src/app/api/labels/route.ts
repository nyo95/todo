import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { createLabelSchema } from '@/lib/validations';

async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return decoded.userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const labels = await db.label.findMany({
      where: { userId },
      include: {
        taskLabels: {
          include: {
            task: {
              select: {
                id: true,
                completed: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error('Get labels error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color } = createLabelSchema.parse(body);

    // Check if label already exists for this user
    const existingLabel = await db.label.findFirst({
      where: {
        name,
        userId
      }
    });

    if (existingLabel) {
      return NextResponse.json(
        { error: 'Label already exists' },
        { status: 400 }
      );
    }

    const label = await db.label.create({
      data: {
        name,
        color: color || '#6B7280',
        userId
      }
    });

    return NextResponse.json(label);
  } catch (error) {
    console.error('Create label error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}