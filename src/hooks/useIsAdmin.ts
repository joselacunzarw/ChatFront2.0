import { useAuthStore } from '../stores/auth';

export function useIsAdmin(): boolean {
  const { user } = useAuthStore();
  return user?.applications?.['chatbot1'] === 'admin';
}