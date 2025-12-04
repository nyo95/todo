import { useState, useEffect } from 'react';
import { Activity } from '@/types';
import { toast } from 'sonner';

const API_BASE = process.env.NODE_ENV === 'production' ? '' : '';

export type ActivityFilters = {
  projectId?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  action?: string;
};

export function useActivity(token: string | null, filters?: ActivityFilters) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setActivities([]);
      setIsLoading(false);
      return;
    }

    loadActivities();
  }, [token, filters?.projectId, filters?.dateRange, filters?.action]);

  const loadActivities = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.projectId) params.append('projectId', filters.projectId);

      const query = params.toString();
      const response = await fetch(
        `${API_BASE}/api/activities${query ? `?${query}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load activities');
      }

      let data = await response.json();

      // Apply date range filter client-side
      if (filters?.dateRange) {
        const now = new Date();
        data = data.filter((activity: Activity) => {
          const activityDate = new Date(activity.createdAt);

          switch (filters.dateRange) {
            case 'today':
              return activityDate.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now);
              weekAgo.setDate(weekAgo.getDate() - 7);
              return activityDate >= weekAgo;
            case 'month':
              const monthAgo = new Date(now);
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return activityDate >= monthAgo;
            default:
              return true;
          }
        });
      }

      // Apply action filter client-side
      if (filters?.action) {
        data = data.filter((activity: Activity) => activity.action === filters.action);
      }

      setActivities(data);
    } catch (error: any) {
      console.error('Load activities error:', error);
      toast.error('Failed to load activity log');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activities,
    isLoading,
    refresh: loadActivities,
  };
}
