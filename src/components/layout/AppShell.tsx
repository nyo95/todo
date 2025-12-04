'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { QuickAddDialog } from '../tasks/QuickAddDialog';
import { ViewType } from '@/types';
import { cn } from '@/lib/utils';

type AppShellProps = {
  children: ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onQuickAdd: () => void;
};

export function AppShell({ children, currentView, onViewChange, onQuickAdd }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar
        currentView={currentView}
        onViewChange={onViewChange}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onQuickAdd={onQuickAdd}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
