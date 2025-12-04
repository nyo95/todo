import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { updateReminderSchema } from '@/lib/validations';

async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return decoded.userId;
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
    const { dateTime, type } = updateReminderSchema.parse(body);

    const reminder = await db.reminder.updateMany({
      where: {
        id: params.id,
        task: {
          userId
        }
      },
      data: {
        dateTime: dateTime ? new Date(dateTime) : undefined,
        type
      }
    });

    if (reminder.count === 0) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    const updatedReminder = await db.reminder.findUnique({
      where: { id: params.id },
      include: {
        task: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error('Update reminder error:', error);
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

    const reminder = await db.reminder.deleteMany({
      where: {
        id: params.id,
        task: {
          userId
        }
      }
    });

    if (reminder.count === 0) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}