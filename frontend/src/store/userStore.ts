import { create } from 'zustand';
import { userApi, User } from '../services/api';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUsers: () => Promise<void>;
  createUser: (
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  loading: false,
  error: null,

  // Actions
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.getAll();
      set({ users: response.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false,
      });
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.create(userData);
      const { users } = get();
      set({
        users: [...users, response.data],
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create user',
        loading: false,
      });
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.update(id, userData);
      const { users } = get();
      set({
        users: users.map((user) => (user.id === id ? response.data : user)),
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update user',
        loading: false,
      });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userApi.delete(id);
      const { users } = get();
      set({
        users: users.filter((user) => user.id !== id),
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete user',
        loading: false,
      });
    }
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  clearError: () => set({ error: null }),
}));
