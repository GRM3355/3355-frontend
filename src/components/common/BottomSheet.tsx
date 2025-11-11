import type { ReactNode } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <div
      className={`absolute -bottom-16 left-0 right-0 inset-0 z-40 transition-all duration-300 
        ${isOpen ? "translate-y-0" : "translate-y-full"} pointer-events-none`}
    >
      {/* 내용 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-2xl shadow-lg pointer-events-auto"
        onClick={onClose} // 이벤트 버블링 방지
      >
        {children}
      </div>
    </div>
  );
}
