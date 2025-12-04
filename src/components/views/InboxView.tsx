'use client';

import { Task } from '@/types';
import { TaskList } from '../tasks/TaskList';
import { Card } from '@/components/ui/card';

type InboxViewProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskClick?: (task: Task) => void;
};

export function InboxView({ tasks, onToggle, onDelete, onTaskClick }: InboxViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
        <p className="text-sm text-gray-600 mt-1">
          Unscheduled tasks without a project
        </p>
      </div>

      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onToggle={onToggle}
          onDelete={onDelete}
          onTaskClick={onTaskClick}
          showProject={false}
        />
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Inbox is empty
            </h3>
            <p className="text-sm text-gray-600">
              All your unscheduled tasks will appear here. Add a task without a due date or project to get started.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
