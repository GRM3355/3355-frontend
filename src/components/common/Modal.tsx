import { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null; // 열리지 않았으면 렌더링 안 함

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50`}
    // onClick={onClose} // 배경 클릭 시 닫기
    >
      <div
        className={`${className} max-w-90`}
        onClick={(e) => e.stopPropagation()} //이벤트 버블링 방지
      >
        {children}
      </div>
    </div>
  );
}
