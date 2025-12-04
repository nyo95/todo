import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { createTaskSchema, taskFiltersSchema } from '@/lib/validations';

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
    const projectId = searchParams.get('projectId');
    const completed = searchParams.get('completed');
    const isArchived = searchParams.get('isArchived');
    const isRecurring = searchParams.get('isRecurring');
    const priority = searchParams.get('priority');
    const dueDate = searchParams.get('dueDate');
    const labelIds = searchParams.get('labelIds')?.split(',').filter(Boolean);

    const where: any = { userId };
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    if (completed !== null) {
      where.completed = completed === 'true';
    }

    if (isArchived !== null) {
      where.isArchived = isArchived === 'true';
    }

    if (isRecurring !== null) {
      where.isRecurring = isRecurring === 'true';
    }

    if (priority) {
      where.priority = priority;
    }

    if (dueDate) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      switch (dueDate) {
        case 'today':
          where.dueDate = {
            gte: today,
            lt: tomorrow
          };
          break;
        case 'week':
          where.dueDate = {
            gte: today,
            lt: weekFromNow
          };
          break;
        case 'month':
          where.dueDate = {
            gte: today,
            lt: monthFromNow
          };
          break;
        case 'overdue':
          where.dueDate = {
            lt: today
          };
          where.completed = false;
          break;
      }
    }

    if (labelIds && labelIds.length > 0) {
      where.taskLabels = {
        some: {
          labelId: {
            in: labelIds
          }
        }
      };
    }

    const tasks = await db.task.findMany({
      where,
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
        reminders: {
          where: {
            dateTime: {
              gte: new Date()
            }
          },
          orderBy: {
            dateTime: 'asc'
          }
        },
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
      },
      orderBy: [
        { completed: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
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
    const { title, description, dueDate, priority, projectId, isRecurring, recurringType, recurringValue } = createTaskSchema.parse(body);

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

    const task = await db.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        projectId,
        isRecurring: isRecurring || false,
        recurringType,
        recurringValue,
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
    await db.activity.create({
      data: {
        action: 'TASK_CREATED',
        taskId: task.id,
        projectId: task.projectId,
        userId
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}