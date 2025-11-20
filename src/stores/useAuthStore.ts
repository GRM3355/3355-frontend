import type { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  accessToken: string;
  user: User | null;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: '',
      user: null,

      setAccessToken: (accessToken) => set({ accessToken, }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: '', user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;