import { create } from 'zustand';

type ConfirmStore = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string; //확인 문구
  cancelText?: string; //취소 문구
  onConfirm?: () => void; //확인 함수
  onCancel?: () => void; //취소 함수
  variant?: 'brand' | 'default' | 'error',
  openConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
    variant?: 'brand' | 'default' | 'error',
  ) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '',
  onConfirm: undefined,
  onCancel: undefined,
  variant: 'brand',

  openConfirm: (title, message, onConfirm, onCancel, confirmText = '확인', cancelText, variant) =>
    set({ isOpen: true, title, message, onConfirm, onCancel, confirmText, cancelText, variant }),

  closeConfirm: () => set({ isOpen: false, message: '' }),
}));
