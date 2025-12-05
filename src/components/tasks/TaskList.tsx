'use client';

import { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { CheckSquare } from 'lucide-react';

type TaskListProps = {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskClick?: (task: Task) => void;
  showProject?: boolean;
};

export function TaskList({
  tasks,
  title,
  emptyMessage = 'No tasks',
  onToggle,
  onDelete,
  onTaskClick,
  showProject = true,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-6 border border-dashed border-slate-200 rounded-xl bg-white/40">
        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckSquare className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-slate-600 text-sm font-medium">{emptyMessage}</p>
        <p className="text-xs text-slate-500 mt-1">Capture a thought with Quick Add to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2 px-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">{tasks.length}</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onClick={onTaskClick}
          showProject={showProject}
        />
      ))}
    </div>
  );
}
