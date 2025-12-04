'use client';

import { ViewType } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Calendar,
  Inbox,
  FolderOpen,
  Activity,
  Settings,
  LogOut,
  CheckSquare,
} from 'lucide-react';

type SidebarProps = {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

const navItems = [
  { id: 'today' as ViewType, label: 'Today', icon: Home, badge: null },
  { id: 'upcoming' as ViewType, label: 'Upcoming', icon: Calendar, badge: null },
  { id: 'inbox' as ViewType, label: 'Inbox', icon: Inbox, badge: null },
  { id: 'projects' as ViewType, label: 'Projects', icon: FolderOpen, badge: null },
];

const bottomItems = [
  { id: 'activity' as ViewType, label: 'Activity', icon: Activity },
  { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
];

export function Sidebar({ currentView, onViewChange, isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
    onMobileClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 truncate">FlowTasks</h1>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-xs text-gray-500">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <Separator />

      <div className="p-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}

        <Separator className="my-2" />

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0">
        {sidebarContent}
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
