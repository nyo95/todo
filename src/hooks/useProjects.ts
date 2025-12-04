import { useState, useEffect, useCallback } from 'react';
import { projectsApi } from '@/lib/api';
import { Project } from '@/types';
import { toast } from 'sonner';

export function useProjects(token: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await projectsApi.getAll(token);
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = async (projectData: Partial<Project>) => {
    if (!token) return null;

    try {
      const newProject = await projectsApi.create(token, projectData);
      setProjects(prev => [newProject, ...prev]);
      toast.success('Project created');
      return newProject;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!token) return null;

    const prevProjects = [...projects];
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    try {
      const updated = await projectsApi.update(token, id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (error: any) {
      setProjects(prevProjects);
      toast.error(error.message || 'Failed to update project');
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    if (!token) return;

    const prevProjects = [...projects];
    setProjects(prev => prev.filter(p => p.id !== id));

    try {
      await projectsApi.delete(token, id);
      toast.success('Project deleted');
    } catch (error: any) {
      setProjects(prevProjects);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const toggleFavorite = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    await updateProject(id, { isFavorite: !project.isFavorite });
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    toggleFavorite,
    refresh: loadProjects,
  };
}
