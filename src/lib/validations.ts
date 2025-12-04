import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  isArchived: z.boolean().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  projectId: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  recurringValue: z.number().int().positive().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

// Labels
export const createLabelSchema = z.object({
  name: z.string().min(1, 'Label name is required'),
  color: z.string().optional(),
});

export const updateLabelSchema = createLabelSchema.partial();

// Comments
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

export const updateCommentSchema = createCommentSchema.partial();

// Reminders
export const createReminderSchema = z.object({
  dateTime: z.string().datetime('Invalid datetime'),
  type: z.enum(['NOTIFICATION', 'EMAIL']).default('NOTIFICATION'),
});

export const updateReminderSchema = createReminderSchema.partial();

// Saved Views
export const createSavedViewSchema = z.object({
  name: z.string().min(1, 'View name is required'),
  filters: z.string(), // JSON string
  isDefault: z.boolean().optional(),
});

export const updateSavedViewSchema = createSavedViewSchema.partial();

// Task Filters
export const taskFiltersSchema = z.object({
  completed: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  projectId: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  dueDate: z.enum(['today', 'week', 'month', 'overdue']).optional(),
  isRecurring: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
export type CreateSavedViewInput = z.infer<typeof createSavedViewSchema>;
export type UpdateSavedViewInput = z.infer<typeof updateSavedViewSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;