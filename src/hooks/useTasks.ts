import { useState, useEffect, useCallback, useMemo } from 'react';
import { tasksApi } from '@/lib/api';
import { Task, TaskFilters } from '@/types';
import { toast } from 'sonner';
import { isToday, isTomorrow, isWithinInterval, addDays, startOfDay, endOfDay, isBefore } from 'date-fns';

export function useTasks(token: string | null, filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTasks = useCallback(async (showLoader = true) => {
    if (!token) return;

    if (showLoader) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await tasksApi.getAll(token, filters);
      setTasks(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token, filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (taskData: Partial<Task>) => {
    if (!token) return null;

    try {
      const newTask = await tasksApi.create(token, taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created');
      return newTask;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!token) return null;

    const prevTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    try {
      const updated = await tasksApi.update(token, id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (error: any) {
      setTasks(prevTasks);
      toast.error(error.message || 'Failed to update task');
      return null;
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    await updateTask(id, { completed: newCompleted });

    if (newCompleted) {
      toast.success('Task completed');
    }
  };

  const deleteTask = async (id: string) => {
    if (!token) return;

    const prevTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await tasksApi.delete(token, id);
      toast.success('Task deleted');
    } catch (error: any) {
      setTasks(prevTasks);
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const todayTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter(task => {
      if (task.completed || task.isArchived) return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return isToday(dueDate) || isBefore(dueDate, startOfDay(now));
    });
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    const nextWeek = addDays(now, 7);

    return {
      tomorrow: tasks.filter(task => {
        if (task.completed || task.isArchived) return false;
        return task.dueDate && isTomorrow(new Date(task.dueDate));
      }),
      nextWeek: tasks.filter(task => {
        if (task.completed || task.isArchived) return false;
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return isWithinInterval(dueDate, {
          start: addDays(tomorrow, 1),
          end: endOfDay(nextWeek),
        });
      }),
      later: tasks.filter(task => {
        if (task.completed || task.isArchived) return false;
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > endOfDay(nextWeek);
      }),
    };
  }, [tasks]);

  const inboxTasks = useMemo(() => {
    return tasks.filter(task => {
      if (task.completed || task.isArchived) return false;
      return !task.dueDate && !task.projectId;
    });
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter(task => {
      if (task.completed || task.isArchived) return false;
      if (!task.dueDate) return false;
      return isBefore(new Date(task.dueDate), startOfDay(now));
    });
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.filter(t => !t.isArchived).length;
    const completed = tasks.filter(t => t.completed && !t.isArchived).length;
    const pending = total - completed;
    const overdue = overdueTasks.length;

    return { total, completed, pending, overdue };
  }, [tasks, overdueTasks]);

  return {
    tasks,
    todayTasks,
    upcomingTasks,
    inboxTasks,
    overdueTasks,
    stats,
    isLoading,
    isRefreshing,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    refresh: () => loadTasks(false),
  };
}
