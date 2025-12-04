'use client';

import { useState, useEffect } from 'react';
import { Task, Project, Priority } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Flag,
  FolderOpen,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { priorityColors } from '@/lib/theme';

type TaskDetailSheetProps = {
  task: Task | null;
  projects: Project[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string, data: Partial<Task>) => void;
  onToggleSubtask: (id: string) => void;
  onDeleteSubtask: (id: string) => void;
};

export function TaskDetailSheet({
  task,
  projects,
  open,
  onClose,
  onSave,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskDetailSheetProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM' as Priority,
    projectId: '',
  });
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate
          ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm")
          : '',
        priority: task.priority,
        projectId: task.projectId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        projectId: '',
      });
    }
    setIsAddingSubtask(false);
    setNewSubtaskTitle('');
  }, [task]);

  const handleSave = () => {
    if (!task) return;

    const updates: Partial<Task> = {};
    if (formData.title !== task.title) updates.title = formData.title;
    if (formData.description !== (task.description || ''))
      updates.description = formData.description;
    if (formData.dueDate !== (task.dueDate || ''))
      updates.dueDate = formData.dueDate || null;
    if (formData.priority !== task.priority) updates.priority = formData.priority;
    if (formData.projectId !== (task.projectId || ''))
      updates.projectId = formData.projectId || null;

    if (Object.keys(updates).length > 0) {
      onSave(task.id, updates);
    }
  };

  const handleAddSubtask = () => {
    if (!task || !newSubtaskTitle.trim()) return;

    onAddSubtask(task.id, {
      title: newSubtaskTitle.trim(),
      priority: 'MEDIUM',
      completed: false,
    });

    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const handleDelete = () => {
    if (!task) return;
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!task) return null;

  const subtasks = task.subtasks || [];
  const comments = task.comments || [];
  const attachments = task.attachments || [];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add a description..."
              rows={4}
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label>
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Project
            </Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData({ ...formData, projectId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="No project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No project</SelectItem>
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
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">
              <Calendar className="w-4 h-4 inline mr-2" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>
              <Flag className="w-4 h-4 inline mr-2" />
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Priority) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', priorityColors.LOW.dot)} />
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', priorityColors.MEDIUM.dot)} />
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="HIGH">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', priorityColors.HIGH.dot)} />
                    High
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Subtasks</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSubtask(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {isAddingSubtask && (
              <div className="flex items-center gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Subtask title"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubtask();
                    } else if (e.key === 'Escape') {
                      setIsAddingSubtask(false);
                      setNewSubtaskTitle('');
                    }
                  }}
                />
                <Button size="sm" onClick={handleAddSubtask}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingSubtask(false);
                    setNewSubtaskTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {subtasks.length > 0 ? (
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 group"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => onToggleSubtask(subtask.id)}
                      className="h-4 w-4"
                    />
                    <span
                      className={cn(
                        'flex-1 text-sm',
                        subtask.completed && 'line-through text-gray-500'
                      )}
                    >
                      {subtask.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSubtask(subtask.id)}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingSubtask && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No subtasks yet
                </p>
              )
            )}
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <Label className="text-base">Comments</Label>
              <Badge variant="secondary" className="ml-auto">
                {comments.length}
              </Badge>
            </div>
            {comments.length > 0 ? (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-gray-50 rounded-md text-sm"
                  >
                    <p className="text-gray-900">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No comments</p>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-600" />
              <Label className="text-base">Attachments</Label>
              <Badge variant="secondary" className="ml-auto">
                {attachments.length}
              </Badge>
            </div>
            {attachments.length > 0 ? (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm flex-1 truncate">
                      {attachment.originalName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No attachments
              </p>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-black hover:bg-gray-800">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
