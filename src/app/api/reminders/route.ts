import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { createReminderSchema } from '@/lib/validations';

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

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    let whereClause: any = {
      task: {
        userId
      }
    };

    if (taskId) {
      whereClause.taskId = taskId;
    }

    const reminders = await db.reminder.findMany({
      where: whereClause,
      include: {
        task: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { dateTime: 'asc' }
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
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
    const { dateTime, type, taskId } = createReminderSchema.parse(body);

    // Verify task belongs to user
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const reminder = await db.reminder.create({
      data: {
        dateTime: new Date(dateTime),
        type: type || 'NOTIFICATION',
        taskId
      },
      include: {
        task: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}