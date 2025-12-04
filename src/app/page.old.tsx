'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import { authApi, projectsApi, tasksApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flag, 
  Trash2, 
  Edit, 
  MoreVertical,
  Layout,
  CheckSquare,
  User,
  LogOut,
  Menu,
  X,
  Home,
  FolderOpen,
  ListTodo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewHeader } from '@/components/ViewHeader';

type Project = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  tasks?: Task[];
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
  projectId?: string | null;
  project?: Project | null;
};

const viewMeta: Record<'dashboard' | 'projects' | 'tasks', { title: string; description: string; eyebrow: string }> = {
  dashboard: {
    eyebrow: 'Inbox',
    title: 'Today & Inbox',
    description: 'Quick stats and the most recent tasks across all projects.',
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Work by project',
    description: 'Favorites, colors, and quick task previews per project.',
  },
  tasks: {
    eyebrow: 'Upcoming',
    title: 'All tasks',
    description: 'Scan and manage every task across projects.',
  },
};

export default function Home() {
  const { user, token, setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'tasks'>('dashboard');

  // Auth forms
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '', name: '' });
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });

  // Project form
  const [projectForm, setProjectForm] = useState({ name: '', description: '', color: '#000000' });
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // Task form
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    projectId: ''
  });
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  useEffect(() => {
    if (token) {
      loadProjects();
      loadTasks();
    }
  }, [token]);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.signUp(signUpForm.email, signUpForm.password, signUpForm.name);
      setAuth(response.user, response.token);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.signIn(signInForm.email, signInForm.password);
      setAuth(response.user, response.token);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async () => {
    if (!token) return;
    try {
      const data = await projectsApi.getAll(token);
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load projects');
    }
  };

  const createProject = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await projectsApi.create(token, projectForm);
      setProjects([...projects, response]);
      setProjectForm({ name: '', description: '', color: '#000000' });
      setIsProjectDialogOpen(false);
      toast.success('Project created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!token) return;
    try {
      await projectsApi.delete(token, id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const loadTasks = async () => {
    if (!token) return;
    try {
      const data = await tasksApi.getAll(token);
      setTasks(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    }
  };

  const createTask = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await tasksApi.create(token, {
        ...taskForm,
        projectId: taskForm.projectId || undefined
      });
      setTasks([response, ...tasks]);
      setTaskForm({ 
        title: '', 
        description: '', 
        dueDate: '', 
        priority: 'MEDIUM',
        projectId: ''
      });
      setIsTaskDialogOpen(false);
      toast.success('Task created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    if (!token) return;
    try {
      const response = await tasksApi.update(token, id, { completed: !completed });
      setTasks(tasks.map(t => t.id === id ? response : t));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!token) return;
    try {
      await tasksApi.delete(token, id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDueDate = (value?: string | null) => {
    if (!value) return 'No due date';
    const date = new Date(value);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskStats = (taskList: Task[]) => {
    const total = taskList.length;
    const completed = taskList.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks]);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Minimal Task</h1>
            <p className="text-gray-600">Focus on what matters most</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-black data-[state=active]:text-white">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-black data-[state=active]:text-white">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSignIn} 
                    disabled={isLoading} 
                    className="w-full bg-black hover:bg-gray-800 text-white py-3"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        id="signup-name"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSignUp} 
                    disabled={isLoading} 
                    className="w-full bg-black hover:bg-gray-800 text-white py-3"
                  >
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          <button
            onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeView === 'dashboard' ? "bg-black text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => { setActiveView('projects'); setIsMobileMenuOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeView === 'projects' ? "bg-black text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => { setActiveView('tasks'); setIsMobileMenuOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeView === 'tasks' ? "bg-black text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <ListTodo className="w-4 h-4" />
            Tasks
          </button>
          <Separator className="my-4" />
          <button
            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <MobileNavigation />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Minimal Task</h1>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={cn(
                    "font-medium transition-colors",
                    activeView === 'dashboard' ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('projects')}
                  className={cn(
                    "font-medium transition-colors",
                    activeView === 'projects' ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveView('tasks')}
                  className={cn(
                    "font-medium transition-colors",
                    activeView === 'tasks' ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Tasks
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">{stats.completed} of {stats.total} completed</p>
              </div>
              <Button onClick={logout} variant="ghost" size="sm" className="hidden sm:flex">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ViewHeader
          eyebrow={viewMeta[activeView].eyebrow}
          title={viewMeta[activeView].title}
          description={viewMeta[activeView].description}
          stats={stats}
        />

        {activeView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <Card className="border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-xl md:text-2xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Circle className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Tasks Section */}
              <div className="lg:col-span-2">
                <Card className="border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Recent Tasks</CardTitle>
                      <CardDescription className="text-gray-600">Manage your daily tasks</CardDescription>
                    </div>
                    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-black hover:bg-gray-800 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Add Task</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Create New Task</DialogTitle>
                          <DialogDescription>Add a new task to your list</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="task-title">Title</Label>
                            <Input
                              id="task-title"
                              value={taskForm.title}
                              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                              placeholder="Task title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                              id="task-description"
                              value={taskForm.description}
                              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                              placeholder="Task description"
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-project">Project</Label>
                            <Select value={taskForm.projectId} onValueChange={(value) => setTaskForm({ ...taskForm, projectId: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">No project</SelectItem>
                                {projects.map((project) => (
                                  <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="task-priority">Priority</Label>
                            <Select value={taskForm.priority} onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH') => setTaskForm({ ...taskForm, priority: value })}>
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
                          <div>
                            <Label htmlFor="task-dueDate">Due Date</Label>
                            <Input
                              id="task-dueDate"
                              type="datetime-local"
                              value={taskForm.dueDate}
                              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                            />
                          </div>
                          <Button onClick={createTask} disabled={isLoading} className="w-full bg-black hover:bg-gray-800 text-white">
                            Create Task
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {sortedTasks.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No tasks yet</p>
                          <p className="text-sm text-gray-400">Create your first task to get started</p>
                        </div>
                      ) : (
                        sortedTasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="group flex items-start gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskComplete(task.id, task.completed)}
                              className="mt-1"
                              aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-gray-900 text-sm md:text-base ${task.completed ? 'line-through opacity-60' : ''}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                                  {task.priority}
                                </Badge>
                                {task.project && (
                                  <Badge variant="outline" className="text-xs">
                                    {task.project.name}
                                  </Badge>
                                )}
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDueDate(task.dueDate)}
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => deleteTask(task.id)} 
                              variant="ghost" 
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label={`Delete task ${task.title}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Projects Section */}
              <div>
                <Card className="border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Projects</CardTitle>
                      <CardDescription className="text-gray-600">Organize your tasks</CardDescription>
                    </div>
                    <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Create New Project</DialogTitle>
                          <DialogDescription>Add a new project to organize your tasks</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="project-name">Name</Label>
                            <Input
                              id="project-name"
                              value={projectForm.name}
                              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                              placeholder="Project name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="project-description">Description</Label>
                            <Textarea
                              id="project-description"
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              placeholder="Project description"
                            />
                          </div>
                          <div>
                            <Label htmlFor="project-color">Color</Label>
                            <Input
                              id="project-color"
                              type="color"
                              value={projectForm.color}
                              onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                            />
                          </div>
                          <Button onClick={createProject} disabled={isLoading} className="w-full bg-black hover:bg-gray-800 text-white">
                            Create Project
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {projects.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Layout className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-sm">No projects yet</p>
                        </div>
                      ) : (
                        projects.map((project) => (
                          <div key={project.id} className="group flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: project.color }}
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{project.name}</p>
                                <p className="text-xs text-gray-500">
                                  {project.tasks?.length || 0} tasks
                                </p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => deleteProject(project.id)} 
                              variant="ghost" 
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              aria-label={`Delete project ${project.name}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeView === 'tasks' && (
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">All Tasks</CardTitle>
                <CardDescription className="text-gray-600">Manage all your tasks in one place</CardDescription>
              </div>
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Add a new task to your list</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="task-title">Title</Label>
                      <Input
                        id="task-title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="Task title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="Task description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-project">Project</Label>
                      <Select value={taskForm.projectId} onValueChange={(value) => setTaskForm({ ...taskForm, projectId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No project</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select value={taskForm.priority} onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH') => setTaskForm({ ...taskForm, priority: value })}>
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
                    <div>
                      <Label htmlFor="task-dueDate">Due Date</Label>
                      <Input
                        id="task-dueDate"
                        type="datetime-local"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      />
                    </div>
                    <Button onClick={createTask} disabled={isLoading} className="w-full bg-black hover:bg-gray-800 text-white">
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sortedTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No tasks yet</p>
                    <p className="text-sm text-gray-400">Create your first task to get started</p>
                  </div>
                ) : (
                  sortedTasks.map((task) => (
                    <div key={task.id} className="group flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskComplete(task.id, task.completed)}
                        className="mt-1"
                        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-gray-900 ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                          {task.project && (
                            <Badge variant="outline" className="text-xs">
                              {task.project.name}
                            </Badge>
                          )}
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDueDate(task.dueDate)}
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => deleteTask(task.id)} 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete task ${task.title}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-gray-200 border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-full w-full flex-col">
                      <Plus className="w-8 h-8 mb-2" />
                      <span>Create Project</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>Add a new project to organize your tasks</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="project-name">Name</Label>
                        <Input
                          id="project-name"
                          value={projectForm.name}
                          onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                          placeholder="Project name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea
                          id="project-description"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          placeholder="Project description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-color">Color</Label>
                        <Input
                          id="project-color"
                          type="color"
                          value={projectForm.color}
                          onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                        />
                      </div>
                      <Button onClick={createProject} disabled={isLoading} className="w-full bg-black hover:bg-gray-800 text-white">
                        Create Project
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {projects.map((project) => (
              <Card key={project.id} className="border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-900">{project.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {project.tasks?.length || 0} tasks
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      onClick={() => deleteProject(project.id)} 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Delete project ${project.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                  )}
                  <div className="space-y-2">
                    {tasks
                      .filter(task => task.projectId === project.id)
                      .slice(0, 3)
                      .map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskComplete(task.id, task.completed)}
                            className="h-4 w-4"
                            aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                          />
                          <span className={cn(
                            "truncate",
                            task.completed && "line-through opacity-60"
                          )}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    {tasks.filter(task => task.projectId === project.id).length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{tasks.filter(task => task.projectId === project.id).length - 3} more tasks
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
