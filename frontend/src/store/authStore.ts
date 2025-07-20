import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

// Helper to get initial auth state from localStorage
const getInitialAuthState = () => {
  if (typeof window === 'undefined')
    return { user: null, isAuthenticated: false };

  try {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { user, isAuthenticated: true };
    }
  } catch (error) {
    console.error('Failed to parse auth data from localStorage:', error);
  }

  return { user: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const initialState = getInitialAuthState();

      return {
        user: initialState.user,
        isAuthenticated: initialState.isAuthenticated,
        setUser: (user) => {
          set({ user, isAuthenticated: !!user });

          // Update localStorage
          if (user && user.token) {
            localStorage.setItem('auth_token', user.token);
            localStorage.setItem('auth_user', JSON.stringify(user));
          } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        },
        logout: () => {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        },
        initializeAuth: () => {
          const authState = getInitialAuthState();
          set({
            user: authState.user,
            isAuthenticated: authState.isAuthenticated,
          });
        },
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
