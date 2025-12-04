export type UserRole = 'STAFF' | 'MANAGER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role?: UserRole;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  completed: boolean;
  isArchived?: boolean;
  projectId?: string | null;
  project?: Project | null;
  createdAt?: string;
  updatedAt?: string;
  taskLabels?: TaskLabel[];
  comments?: Comment[];
  attachments?: Attachment[];
  reminders?: Reminder[];
  subtasks?: Task[];
  parentTaskId?: string | null;
};

export type TaskLabel = {
  id: string;
  taskId: string;
  labelId: string;
  label: Label;
};

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;
  user: User;
};

export type Attachment = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
};

export type Reminder = {
  id: string;
  dateTime: string;
  type: 'NOTIFICATION' | 'EMAIL';
  isSent: boolean;
};

export type ActivityType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'TASK_UNCOMPLETED'
  | 'TASK_DELETED'
  | 'TASK_ARCHIVED'
  | 'TASK_UNARCHIVED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'PROJECT_ARCHIVED'
  | 'PROJECT_UNARCHIVED'
  | 'COMMENT_ADDED'
  | 'ATTACHMENT_ADDED'
  | 'LABEL_ADDED'
  | 'LABEL_REMOVED';

export type Activity = {
  id: string;
  action: ActivityType;
  details?: string | null;
  createdAt: string;
  taskId?: string | null;
  task?: Task | null;
  projectId?: string | null;
  userId: string;
  user: User;
};

export type ViewType = 'today' | 'upcoming' | 'inbox' | 'projects' | 'activity' | 'settings';

export type TaskFilters = {
  projectId?: string;
  priority?: Priority;
  completed?: boolean;
  dueDate?: 'today' | 'tomorrow' | 'week' | 'overdue';
  search?: string;
};
