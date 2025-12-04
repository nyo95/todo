import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { updateTaskSchema } from '@/lib/validations';

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

    const task = await db.task.findFirst({
      where: {
        id: params.id,
        userId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
            isFavorite: true,
            isArchived: true
          }
        },
        taskLabels: {
          include: {
            label: true
          }
        },
        reminders: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        attachments: true
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Get task error:', error);
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
    const { title, description, dueDate, priority, projectId, completed, isArchived, isRecurring, recurringType, recurringValue } = updateTaskSchema.parse(body);

    // Get original task for activity logging
    const originalTask = await db.task.findFirst({
      where: { id: params.id, userId }
    });

    if (!originalTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Verify project belongs to user if projectId is provided
    if (projectId) {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          userId
        }
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
    }

    const task = await db.task.updateMany({
      where: {
        id: params.id,
        userId
      },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        projectId,
        completed,
        isArchived,
        isRecurring,
        recurringType,
        recurringValue
      }
    });

    if (task.count === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask = await db.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
            isFavorite: true,
            isArchived: true
          }
        },
        taskLabels: {
          include: {
            label: true
          }
        },
        reminders: true,
        comments: {
          select: {
            id: true
          }
        },
        attachments: {
          select: {
            id: true
          }
        }
      }
    });

    // Log activity
    if (completed !== undefined && completed !== originalTask.completed) {
      await db.activity.create({
        data: {
          action: completed ? 'TASK_COMPLETED' : 'TASK_UNCOMPLETED',
          taskId: params.id,
          projectId: updatedTask?.projectId,
          userId
        }
      });
    } else if (isArchived !== undefined && isArchived !== originalTask.isArchived) {
      await db.activity.create({
        data: {
          action: isArchived ? 'TASK_ARCHIVED' : 'TASK_UNARCHIVED',
          taskId: params.id,
          projectId: updatedTask?.projectId,
          userId
        }
      });
    } else {
      await db.activity.create({
        data: {
          action: 'TASK_UPDATED',
          taskId: params.id,
          projectId: updatedTask?.projectId,
          userId
        }
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
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

    const task = await db.task.findFirst({
      where: {
        id: params.id,
        userId
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await db.task.deleteMany({
      where: {
        id: params.id,
        userId
      }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'TASK_DELETED',
        taskId: params.id,
        projectId: task.projectId,
        userId
      }
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}