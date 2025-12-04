'use client';

import { Project, Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Star, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ProjectsViewProps = {
  projects: Project[];
  tasks: Task[];
  onCreateProject: (data: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTaskToggle: (id: string) => void;
};

export function ProjectsView({
  projects,
  tasks,
  onCreateProject,
  onDeleteProject,
  onToggleFavorite,
  onTaskToggle,
}: ProjectsViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onCreateProject(formData);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setIsDialogOpen(false);
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId && !t.completed && !t.isArchived);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-600 mt-1">
            Organize your tasks into projects
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  autoFocus
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="mt-1.5 h-10"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className="bg-black hover:bg-gray-800"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map((project) => {
            const projectTasks = getProjectTasks(project.id);

            return (
              <Card key={project.id} className="group relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: project.color || '#666' }}
                      />
                      <CardTitle className="text-base truncate">
                        {project.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleFavorite(project.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            project.isFavorite
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-400'
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProject(project.id)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500 mb-3">
                    {projectTasks.length} active {projectTasks.length === 1 ? 'task' : 'tasks'}
                  </div>

                  {projectTasks.length > 0 && (
                    <div className="space-y-2">
                      {projectTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-start gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => onTaskToggle(task.id)}
                            className="mt-0.5 h-4 w-4"
                          />
                          <p className="text-sm text-gray-700 line-clamp-1 flex-1">
                            {task.title}
                          </p>
                        </div>
                      ))}
                      {projectTasks.length > 3 && (
                        <p className="text-xs text-gray-500 pl-6">
                          +{projectTasks.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Create your first project to start organizing your tasks.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-black hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
