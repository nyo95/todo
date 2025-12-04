'use client';

import { Task } from '@/types';
import { TaskList } from '../tasks/TaskList';
import { Card } from '@/components/ui/card';

type UpcomingViewProps = {
  tomorrow: Task[];
  nextWeek: Task[];
  later: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskClick?: (task: Task) => void;
};

export function UpcomingView({
  tomorrow,
  nextWeek,
  later,
  onToggle,
  onDelete,
  onTaskClick,
}: UpcomingViewProps) {
  const hasTasks = tomorrow.length > 0 || nextWeek.length > 0 || later.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upcoming</h1>
        <p className="text-sm text-gray-600 mt-1">
          Tasks scheduled for the future
        </p>
      </div>

      {hasTasks ? (
        <div className="space-y-8">
          {tomorrow.length > 0 && (
            <div>
              <TaskList
                tasks={tomorrow}
                title="Tomorrow"
                onToggle={onToggle}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
              />
            </div>
          )}

          {nextWeek.length > 0 && (
            <div>
              <TaskList
                tasks={nextWeek}
                title="Next 7 days"
                onToggle={onToggle}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
              />
            </div>
          )}

          {later.length > 0 && (
            <div>
              <TaskList
                tasks={later}
                title="Later"
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No upcoming tasks
            </h3>
            <p className="text-sm text-gray-600">
              You don't have any tasks scheduled for the future yet.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
