'use client';

import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, MessageSquare, Paperclip, Dot } from 'lucide-react';
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

  const getDueDateTone = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) return 'text-red-600 bg-red-50 border-red-100';
    if (isToday(date)) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-slate-600 bg-slate-50 border-slate-200/80';
  };

  const priorityTone = priorityColors[task.priority];

  return (
    <article
      className={cn(
        'group flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white/80 px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur transition-all',
        'hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300',
        task.completed && 'opacity-70'
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className={cn('mt-1 shrink-0 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800')}
      />

      <div className="flex-1 min-w-0" onClick={() => onClick?.(task)}>
        <div className="flex items-start gap-2">
          <div className="flex-1 space-y-1">
            <p
              className={cn(
                'text-sm font-medium text-slate-900 leading-relaxed',
                task.completed && 'line-through text-slate-500'
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p
                className={cn(
                  'text-xs text-slate-600 line-clamp-2',
                  task.completed && 'text-slate-400'
                )}
              >
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
            <Dot className={cn('h-4 w-4', priorityTone.dot)} />
            <span className="tracking-tight">{task.priority}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {task.dueDate && (
            <Badge
              variant="outline"
              className={cn(
                'border text-[11px] font-medium px-2.5 py-1 flex items-center gap-1.5',
                getDueDateTone(task.dueDate)
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              {formatDueDate(task.dueDate)}
            </Badge>
          )}

          {showProject && task.project && (
            <Badge variant="outline" className="text-[11px] h-7 bg-slate-50 border-slate-200">
              <div
                className="mr-1.5 h-2 w-2 rounded-full"
                style={{ backgroundColor: task.project.color || '#666' }}
              />
              {task.project.name}
            </Badge>
          )}

          {task.comments && task.comments.length > 0 && (
            <Badge variant="secondary" className="text-[11px] h-7 bg-slate-100 text-slate-700">
              <MessageSquare className="h-3.5 w-3.5" />
              {task.comments.length}
            </Badge>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <Badge variant="secondary" className="text-[11px] h-7 bg-slate-100 text-slate-700">
              <Paperclip className="h-3.5 w-3.5" />
              {task.attachments.length}
            </Badge>
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
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-500 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </article>
  );
}
