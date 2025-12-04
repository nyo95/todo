import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { updateProjectSchema } from '@/lib/validations';

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

    const project = await db.project.findFirst({
      where: {
        id: params.id,
        userId
      },
      include: {
        tasks: {
          include: {
            taskLabels: {
              include: {
                label: true
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
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Get project error:', error);
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
    const { name, description, color, isFavorite, isArchived } = updateProjectSchema.parse(body);

    // Get original project for activity logging
    const originalProject = await db.project.findFirst({
      where: { id: params.id, userId }
    });

    if (!originalProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = await db.project.updateMany({
      where: {
        id: params.id,
        userId
      },
      data: {
        name,
        description,
        color,
        isFavorite,
        isArchived
      }
    });

    if (project.count === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject = await db.project.findUnique({
      where: { id: params.id }
    });

    // Log activity
    if (isArchived !== undefined && isArchived !== originalProject.isArchived) {
      await db.activity.create({
        data: {
          action: isArchived ? 'PROJECT_ARCHIVED' : 'PROJECT_UNARCHIVED',
          projectId: params.id,
          userId
        }
      });
    } else {
      await db.activity.create({
        data: {
          action: 'PROJECT_UPDATED',
          projectId: params.id,
          userId
        }
      });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
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

    const project = await db.project.findFirst({
      where: {
        id: params.id,
        userId
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await db.project.deleteMany({
      where: {
        id: params.id,
        userId
      }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'PROJECT_DELETED',
        projectId: params.id,
        userId
      }
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}