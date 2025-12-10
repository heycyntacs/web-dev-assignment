import { redirect } from '@tanstack/react-router';
import { checkAuthRequest } from '@/api/auth';
import { store } from '@/app/store';

const AUTH_STORAGE_KEY = 'auth_state';

interface AuthState {
  user: { id: string; username: string } | null;
}

export const getCurrentUser = (): { id: string; username: string } | null => {
  // Try to get from Redux store first
  const state = store.getState();
  const user = state.auth.user;

  if (user) {
    return user;
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed: AuthState = JSON.parse(stored);
      return parsed.user || null;
    }
  } catch {
    // Ignore errors
  }

  return null;
};

export const checkAuth = async (): Promise<{
  id: string;
  username: string;
} | null> => {
  try {
    const response = await checkAuthRequest();

    return response.user;
  } catch {
    return null;
  }
};

export const requireAuth = async () => {
  const user = await checkAuth();

  if (user) return;

  throw redirect({
    to: '/login',
  });
};

export const redirectIfAuthenticated = async () => {
  const user = await checkAuth();

  if (!user) return;

  throw redirect({
    to: '/app',
  });
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await checkAuth();

  return !!user;
};
