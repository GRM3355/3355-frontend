import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  tempToken: string;
  setTempToken: (token: string) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  tempToken: '',

  setTempToken: (token: string) => set({ tempToken: token }),
}

));

// const useAuthStore = create<AuthStore>()(
//   persist(
//     (set) => ({
//       tempToken: '',
//       setTempToken: (token) => set({ tempToken: token }),
//     }),
//     {
//       name: 'auth-storage',
//       getStorage: () => localStorage,
//     }
//   )
// );

export default useAuthStore;
