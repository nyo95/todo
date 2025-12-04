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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-3">
          {title} ({tasks.length})
        </h3>
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
