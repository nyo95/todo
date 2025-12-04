'use client';

import { Activity } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Archive,
  ArchiveRestore,
  FolderPlus,
  FolderEdit,
  Folder,
  MessageSquarePlus,
  Paperclip,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityItemProps = {
  activity: Activity;
  showProject?: boolean;
};

const activityIcons = {
  TASK_CREATED: Circle,
  TASK_UPDATED: Circle,
  TASK_COMPLETED: CheckCircle2,
  TASK_UNCOMPLETED: Circle,
  TASK_DELETED: Trash2,
  TASK_ARCHIVED: Archive,
  TASK_UNARCHIVED: ArchiveRestore,
  PROJECT_CREATED: FolderPlus,
  PROJECT_UPDATED: FolderEdit,
  PROJECT_DELETED: Folder,
  PROJECT_ARCHIVED: Archive,
  PROJECT_UNARCHIVED: ArchiveRestore,
  COMMENT_ADDED: MessageSquarePlus,
  ATTACHMENT_ADDED: Paperclip,
  LABEL_ADDED: Tag,
  LABEL_REMOVED: Tag,
};

const activityColors = {
  TASK_CREATED: 'text-blue-600 bg-blue-50',
  TASK_UPDATED: 'text-gray-600 bg-gray-50',
  TASK_COMPLETED: 'text-green-600 bg-green-50',
  TASK_UNCOMPLETED: 'text-gray-600 bg-gray-50',
  TASK_DELETED: 'text-red-600 bg-red-50',
  TASK_ARCHIVED: 'text-amber-600 bg-amber-50',
  TASK_UNARCHIVED: 'text-blue-600 bg-blue-50',
  PROJECT_CREATED: 'text-blue-600 bg-blue-50',
  PROJECT_UPDATED: 'text-gray-600 bg-gray-50',
  PROJECT_DELETED: 'text-red-600 bg-red-50',
  PROJECT_ARCHIVED: 'text-amber-600 bg-amber-50',
  PROJECT_UNARCHIVED: 'text-blue-600 bg-blue-50',
  COMMENT_ADDED: 'text-purple-600 bg-purple-50',
  ATTACHMENT_ADDED: 'text-indigo-600 bg-indigo-50',
  LABEL_ADDED: 'text-teal-600 bg-teal-50',
  LABEL_REMOVED: 'text-gray-600 bg-gray-50',
};

const activityMessages = {
  TASK_CREATED: 'created task',
  TASK_UPDATED: 'updated task',
  TASK_COMPLETED: 'completed task',
  TASK_UNCOMPLETED: 'uncompleted task',
  TASK_DELETED: 'deleted task',
  TASK_ARCHIVED: 'archived task',
  TASK_UNARCHIVED: 'unarchived task',
  PROJECT_CREATED: 'created project',
  PROJECT_UPDATED: 'updated project',
  PROJECT_DELETED: 'deleted project',
  PROJECT_ARCHIVED: 'archived project',
  PROJECT_UNARCHIVED: 'unarchived project',
  COMMENT_ADDED: 'added comment',
  ATTACHMENT_ADDED: 'added attachment',
  LABEL_ADDED: 'added label',
  LABEL_REMOVED: 'removed label',
};

export function ActivityItem({ activity, showProject = true }: ActivityItemProps) {
  const Icon = activityIcons[activity.action] || AlertCircle;
  const colorClass = activityColors[activity.action] || 'text-gray-600 bg-gray-50';
  const message = activityMessages[activity.action] || 'updated';

  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={cn('p-2 rounded-full shrink-0', colorClass)}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{activity.user?.name || 'User'}</span>
              {' '}
              <span className="text-gray-600">{message}</span>
              {activity.task && (
                <>
                  {' '}
                  <span className="font-medium truncate inline-block max-w-xs align-bottom">
                    {activity.task.title}
                  </span>
                </>
              )}
            </p>
            {activity.details && (
              <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
            )}
          </div>
          <time className="text-xs text-gray-500 shrink-0">{timeAgo}</time>
        </div>
      </div>
    </div>
  );
}
