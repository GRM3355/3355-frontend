import { create } from 'zustand';

type LoginStore = {
  isLoginModalOpen: boolean;
  isLoggedIn: boolean;

  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const useLoginStore = create<LoginStore>()((set) => ({
  isLoginModalOpen: false,
  isLoggedIn: false,

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
})
);

export default useLoginStore;
