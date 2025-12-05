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
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Focus for today</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-1">Today</h1>
            <p className="text-sm text-slate-600 mt-1">{todayLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-inner">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Due</p>
              <p className="text-lg font-semibold">{todayTasks.length + overdueTasks.length}</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-inner">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Overdue</p>
              <p className="text-lg font-semibold text-red-600">{overdueTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {hasTasks ? (
        <div className="space-y-8">
          {overdueTasks.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
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
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
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
