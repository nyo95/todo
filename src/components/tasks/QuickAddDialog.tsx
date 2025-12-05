'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, Priority } from '@/types';
import { Calendar, Flag } from 'lucide-react';

type QuickAddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  projects: Project[];
};

export type TaskFormData = {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  projectId?: string;
};

const NO_PROJECT_VALUE = '__no_project__';

export function QuickAddDialog({ open, onOpenChange, onSubmit, projects }: QuickAddDialogProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    projectId: undefined,
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        projectId: undefined,
      });
      setShowDetails(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const submitData: TaskFormData = {
      ...formData,
      projectId: formData.projectId || undefined,
      dueDate: formData.dueDate || undefined,
      description: formData.description || undefined,
    };

    onSubmit(submitData);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">Quick Add</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm text-slate-600">Task name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Capture a task..."
              autoFocus
              className="mt-1.5 h-12 text-[15px]"
            />
            <p className="text-xs text-slate-500">Only the title is required—everything else is optional.</p>
          </div>

          {showDetails && (
            <div className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs text-slate-600">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add context, links, or acceptance criteria"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5" />
                    Due date
                  </Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="flex items-center gap-2 text-xs text-slate-600">
                    <Flag className="w-3.5 h-3.5" />
                    Priority
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project" className="text-xs text-slate-600">Project</Label>
                <Select
                  value={formData.projectId ?? NO_PROJECT_VALUE}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      projectId: value === NO_PROJECT_VALUE ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Inbox (no project)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PROJECT_VALUE}>Inbox (no project)</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: project.color || '#666' }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? 'Hide optional details' : 'Add optional details'}
            </button>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim()}
                className="bg-black hover:bg-gray-800"
              >
                Add Task
              </Button>
            </div>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to submit
        </p>
      </DialogContent>
    </Dialog>
  );
}
