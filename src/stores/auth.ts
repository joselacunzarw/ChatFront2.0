import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types/auth';
import { loginWithCredentials, loginWithGoogle, createDevUser } from '../services/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          if (import.meta.env.VITE_DEV_MODE === 'true' && email === 'dev@local') {
            const { user, token } = createDevUser();
            set({ user, token, isAuthenticated: true });
            return;
          }

          const { user, token } = await loginWithCredentials(email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          // Reset state and re-throw the error
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      loginWithGoogle: async (credential: string) => {
        try {
          const { user, token } = await loginWithGoogle(credential);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);