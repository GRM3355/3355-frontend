import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  tempToken: string;
  userId: string;
  lat: number;
  lon: number;

  setTempToken: (token: string) => void;
  setUserId: (id: string) => void;
  setCoord: (lat: number, lon: number) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      tempToken: '',
      userId: '',
      lat: 0,
      lon: 0,

      setTempToken: (tempToken) => set({ tempToken }),
      setUserId: (userId) => set({ userId }),
      setCoord: (lat, lon) => set({ lat, lon }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;