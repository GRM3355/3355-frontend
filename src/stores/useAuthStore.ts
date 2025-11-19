import type { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  tempToken: string;
  accessToken: string;
  user: User | null;
  lat: number;
  lon: number;

  setTempToken: (token: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setCoord: (lat: number, lon: number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      tempToken: '',
      accessToken: '',
      user: null,
      lat: 0,
      lon: 0,

      setTempToken: (tempToken) => set({ tempToken }),
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