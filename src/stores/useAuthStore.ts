import type { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  accessToken: string;
  user: User | null;
  lat: number;
  lon: number;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setCoord: (lat: number, lon: number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: '',
      user: null,
      lat: 0,
      lon: 0,

      setAccessToken: (accessToken) => set({ accessToken, }),
      setUser: (user) => set({ user }),
      setCoord: (lat, lon) => set({ lat, lon }),
      logout: () => set({ accessToken: '', user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;