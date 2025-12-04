'use client';

import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Flag, MessageSquare, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { priorityColors } from '@/lib/theme';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (task: Task) => void;
  showProject?: boolean;
};

export function TaskItem({ task, onToggle, onDelete, onClick, showProject = true }: TaskItemProps) {
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getDueDateColor = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) return 'text-red-600';
    if (isToday(date)) return 'text-amber-600';
    return 'text-gray-500';
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 border border-gray-200 rounded-lg transition-all',
        'hover:bg-gray-50 hover:shadow-sm',
        task.completed && 'opacity-60'
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className={cn('mt-0.5 shrink-0', task.completed && 'data-[state=checked]:bg-gray-400')}
      />

      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onClick?.(task)}
      >
        <div className="flex items-start gap-2">
          <p className={cn(
            'text-sm font-medium text-gray-900 flex-1',
            task.completed && 'line-through text-gray-500'
          )}>
            {task.title}
          </p>
          {task.priority !== 'MEDIUM' && (
            <Flag
              className={cn(
                'w-4 h-4 shrink-0',
                task.priority === 'HIGH' && 'text-red-500 fill-red-500',
                task.priority === 'LOW' && 'text-blue-500'
              )}
            />
          )}
        </div>

        {task.description && (
          <p className={cn(
            'text-xs text-gray-600 mt-1 line-clamp-2',
            task.completed && 'text-gray-400'
          )}>
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {task.dueDate && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              getDueDateColor(task.dueDate)
            )}>
              <Calendar className="w-3 h-3" />
              {formatDueDate(task.dueDate)}
            </div>
          )}

          {showProject && task.project && (
            <Badge variant="outline" className="text-xs h-5">
              <div
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: task.project.color || '#666' }}
              />
              {task.project.name}
            </Badge>
          )}

          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </div>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Paperclip className="w-3 h-3" />
              {task.attachments.length}
            </div>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
}
