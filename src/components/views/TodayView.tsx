'use client';

import { Task } from '@/types';
import { TaskList } from '../tasks/TaskList';
import { Card } from '@/components/ui/card';

type TodayViewProps = {
  todayTasks: Task[];
  overdueTasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskClick?: (task: Task) => void;
};

export function TodayView({ todayTasks, overdueTasks, onToggle, onDelete, onTaskClick }: TodayViewProps) {
  const hasTasks = todayTasks.length > 0 || overdueTasks.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Today</h1>
        <p className="text-sm text-gray-600 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {hasTasks ? (
        <div className="space-y-8">
          {overdueTasks.length > 0 && (
            <div>
              <TaskList
                tasks={overdueTasks}
                title="Overdue"
                onToggle={onToggle}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
              />
            </div>
          )}

          {todayTasks.length > 0 && (
            <div>
              <TaskList
                tasks={todayTasks}
                title={overdueTasks.length > 0 ? 'Today' : undefined}
                onToggle={onToggle}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
              />
            </div>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All clear for today
            </h3>
            <p className="text-sm text-gray-600">
              You have no tasks due today. Great job staying on top of things!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
