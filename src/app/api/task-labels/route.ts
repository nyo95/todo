import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return decoded.userId;
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
    const { taskId, labelId } = body;

    if (!taskId || !labelId) {
      return NextResponse.json(
        { error: 'Task ID and Label ID are required' },
        { status: 400 }
      );
    }

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

    // Verify label belongs to user
    const label = await db.label.findFirst({
      where: {
        id: labelId,
        userId
      }
    });

    if (!label) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }

    // Check if already assigned
    const existingAssignment = await db.taskLabel.findFirst({
      where: {
        taskId,
        labelId
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Label already assigned to task' },
        { status: 400 }
      );
    }

    const taskLabel = await db.taskLabel.create({
      data: {
        taskId,
        labelId
      },
      include: {
        label: true
      }
    });

    return NextResponse.json(taskLabel);
  } catch (error) {
    console.error('Assign label error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const labelId = searchParams.get('labelId');

    if (!taskId || !labelId) {
      return NextResponse.json(
        { error: 'Task ID and Label ID are required' },
        { status: 400 }
      );
    }

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

    // Verify label belongs to user
    const label = await db.label.findFirst({
      where: {
        id: labelId,
        userId
      }
    });

    if (!label) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }

    const taskLabel = await db.taskLabel.deleteMany({
      where: {
        taskId,
        labelId
      }
    });

    if (taskLabel.count === 0) {
      return NextResponse.json(
        { error: 'Label assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Label removed from task successfully' });
  } catch (error) {
    console.error('Remove label error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}