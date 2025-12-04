'use client';

import { useState, useEffect } from 'react';
import { ViewType, Task } from '@/types';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useActivity } from '@/hooks/useActivity';
import { AppShell } from '@/components/layout/AppShell';
import { TodayView } from '@/components/views/TodayView';
import { UpcomingView } from '@/components/views/UpcomingView';
import { InboxView } from '@/components/views/InboxView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { ActivityView } from '@/components/views/ActivityView';
import { SettingsView } from '@/components/views/SettingsView';
import { QuickAddDialog } from '@/components/tasks/QuickAddDialog';
import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { user, token } = useAuthStore();
  const { signIn, signUp, logout, isLoading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activityFilters, setActivityFilters] = useState<{
    projectId?: string;
    dateRange?: string;
  }>({});

  // Auth forms
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '', name: '' });

  // Data hooks
  const {
    tasks,
    todayTasks,
    overdueTasks,
    upcomingTasks,
    inboxTasks,
    stats,
    isLoading: tasksLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks(token);

  const {
    projects,
    isLoading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    toggleFavorite,
  } = useProjects(token);

  const {
    activities,
    isLoading: activitiesLoading,
    refresh: refreshActivities,
  } = useActivity(token, activityFilters);

  // Handle quick add
  const handleQuickAdd = async (data: Partial<Task>) => {
    await createTask(data);
    setIsQuickAddOpen(false);
  };

  // Handle task updates from detail sheet
  const handleTaskUpdate = async (id: string, data: Partial<Task>) => {
    await updateTask(id, data);
    setSelectedTask(null);
  };

  // Handle subtask operations
  const handleAddSubtask = async (parentId: string, data: Partial<Task>) => {
    await createTask({ ...data, parentTaskId: parentId });
    // Refresh tasks to get updated subtasks
    const updatedTask = tasks.find(t => t.id === parentId);
    if (updatedTask) {
      setSelectedTask({ ...updatedTask });
    }
  };

  const handleToggleSubtask = async (id: string) => {
    await toggleTask(id);
  };

  const handleDeleteSubtask = async (id: string) => {
    await deleteTask(id);
  };

  // Handle task click to open detail sheet
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(signInForm.email, signInForm.password);
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(signUpForm.email, signUpForm.password, signUpForm.name);
  };

  // Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FlowTasks</h1>
            <p className="text-gray-600">Organize your work and life, finally.</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                        placeholder="Enter your email"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="mt-1"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-black hover:bg-gray-800 text-white py-3"
                    >
                      {authLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">
                        Name
                      </Label>
                      <Input
                        id="signup-name"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                        placeholder="Enter your email"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="mt-1"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-black hover:bg-gray-800 text-white py-3"
                    >
                      {authLoading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <>
      <AppShell
        user={user}
        stats={stats}
        currentView={currentView}
        onViewChange={setCurrentView}
        onQuickAdd={() => setIsQuickAddOpen(true)}
        onLogout={logout}
      >
        {currentView === 'today' && (
          <TodayView
            todayTasks={todayTasks}
            overdueTasks={overdueTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onTaskClick={handleTaskClick}
          />
        )}

        {currentView === 'upcoming' && (
          <UpcomingView
            tomorrow={upcomingTasks.tomorrow}
            nextWeek={upcomingTasks.nextWeek}
            later={upcomingTasks.later}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onTaskClick={handleTaskClick}
          />
        )}

        {currentView === 'inbox' && (
          <InboxView
            tasks={inboxTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onTaskClick={handleTaskClick}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsView
            projects={projects}
            tasks={tasks}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
            onToggleFavorite={toggleFavorite}
            onTaskToggle={toggleTask}
          />
        )}

        {currentView === 'activity' && (
          <ActivityView
            activities={activities}
            projects={projects}
            isLoading={activitiesLoading}
            onFilterChange={setActivityFilters}
          />
        )}

        {currentView === 'settings' && <SettingsView user={user} />}
      </AppShell>

      <QuickAddDialog
        open={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleQuickAdd}
        projects={projects}
      />

      <TaskDetailSheet
        task={selectedTask}
        projects={projects}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleTaskUpdate}
        onDelete={deleteTask}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
      />
    </>
  );
}
