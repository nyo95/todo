'use client';

import { useState, useMemo } from 'react';
import { Activity, Project } from '@/types';
import { ActivityItem } from '../activity/ActivityItem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Clock, Filter } from 'lucide-react';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

type ActivityViewProps = {
  activities: Activity[];
  projects: Project[];
  isLoading?: boolean;
  onFilterChange?: (filters: { projectId?: string; dateRange?: string }) => void;
};

type ViewMode = 'list' | 'timeline';

export function ActivityView({
  activities,
  projects,
  isLoading = false,
  onFilterChange,
}: ActivityViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    onFilterChange?.({
      projectId: value === 'all' ? undefined : value,
      dateRange: dateRange === 'all' ? undefined : dateRange,
    });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onFilterChange?.({
      projectId: selectedProject === 'all' ? undefined : selectedProject,
      dateRange: value === 'all' ? undefined : value,
    });
  };

  const groupedActivities = useMemo(() => {
    if (viewMode === 'list') {
      return { all: activities };
    }

    const groups: Record<string, Activity[]> = {};

    activities.forEach((activity) => {
      const date = new Date(activity.createdAt);
      const dateKey = startOfDay(date).toISOString();

      let label: string;
      if (isToday(date)) {
        label = 'Today';
      } else if (isYesterday(date)) {
        label = 'Yesterday';
      } else {
        label = format(date, 'MMMM d, yyyy');
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .reduce((acc, [key, value]) => {
        const date = new Date(key);
        let label: string;
        if (isToday(date)) {
          label = 'Today';
        } else if (isYesterday(date)) {
          label = 'Yesterday';
        } else {
          label = format(date, 'MMMM d, yyyy');
        }
        acc[label] = value;
        return acc;
      }, {} as Record<string, Activity[]>);
  }, [activities, viewMode]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track changes and updates across all your tasks and projects
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <List className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedProject} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color || '#666' }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'list' ? (
            <Card className="divide-y">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </Card>
          ) : (
            Object.entries(groupedActivities).map(([dateLabel, groupActivities]) => (
              <div key={dateLabel}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">{dateLabel}</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-500">
                    {groupActivities.length} {groupActivities.length === 1 ? 'activity' : 'activities'}
                  </span>
                </div>
                <Card className="divide-y">
                  {groupActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </Card>
              </div>
            ))
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-sm text-gray-600">
              {selectedProject !== 'all' || dateRange !== 'all'
                ? 'No activities match your current filters. Try adjusting your selection.'
                : 'Start creating tasks and projects to see your activity here.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
