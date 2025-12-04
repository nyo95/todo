import { useAuthStore } from '@/store/auth';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

export function useAuth() {
  const { user, token, setAuth, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.signIn(email, password);
      setAuth(response.user, response.token);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.signUp(email, password, name);
      setAuth(response.user, response.token);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    toast.success('Signed out successfully');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    signIn,
    signUp,
    logout,
  };
}
