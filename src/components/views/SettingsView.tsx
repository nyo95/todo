'use client';

import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Shield, Bell, Palette, Info } from 'lucide-react';

type SettingsViewProps = {
  user: User;
};

export function SettingsView({ user }: SettingsViewProps) {
  const getRoleBadge = (role: string) => {
    if (role === 'MANAGER') {
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Manager</Badge>;
    }
    return <Badge variant="secondary">Staff</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={user.name || 'User'}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Profile editing is coming soon
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Account Role</Label>
              <div className="flex items-center gap-2">
                {getRoleBadge(user.role || 'STAFF')}
                {user.role === 'MANAGER' && (
                  <span className="text-xs text-gray-500">
                    You have full access to all features
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Password</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Last changed: Never
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Change Password
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add an extra layer of security
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receive updates via email
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Configure
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Task Reminders</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Get notified about upcoming tasks
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-600" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the look and feel of the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Theme</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Light mode only (dark mode coming soon)
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Change Theme
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-600" />
              <CardTitle>About</CardTitle>
            </div>
            <CardDescription>
              Application information and support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <Separator className="my-3" />
            <div className="pt-2">
              <p className="text-xs text-gray-500">
                FlowTasks - A modern task management application
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
