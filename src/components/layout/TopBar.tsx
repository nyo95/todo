'use client';

import { Button } from '@/components/ui/button';
import { Plus, Menu } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';

type TopBarProps = {
  onQuickAdd: () => void;
  onMobileMenuToggle: () => void;
};

export function TopBar({ onQuickAdd, onMobileMenuToggle }: TopBarProps) {
  const { token } = useAuth();
  const { stats } = useTasks(token);

  return (
    <header className="h-16 bg-white border-b border-gray-200 shrink-0">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total:</span>
              <span className="font-medium text-gray-900">{stats.total}</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Pending:</span>
              <span className="font-medium text-amber-600">{stats.pending}</span>
            </div>
            {stats.overdue > 0 && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Overdue:</span>
                  <span className="font-medium text-red-600">{stats.overdue}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={onQuickAdd}
          size="sm"
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Quick Add</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
}
