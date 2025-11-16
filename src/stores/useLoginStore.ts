import type { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LoginStore = {
  isLoginModalOpen: boolean;
  isLoggedIn: boolean;
  user: User | null;

  setIsLoggedIn: (b: boolean) => void;
  setUser: (user: User) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      isLoginModalOpen: false,
      isLoggedIn: false,
      user: null,

      setIsLoggedIn: (b) => set({ isLoggedIn: b }),
      setUser: (user) => set({ user }),

      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
    }),
    {
      name: 'login-store', // localStorage key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        // isLoginModalOpen는 persist에서 제외
      }),
    }
  )
);

export default useLoginStore;
