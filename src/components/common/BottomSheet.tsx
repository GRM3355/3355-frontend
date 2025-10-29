import type { ReactNode } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 inset-0 z-40 transition-all duration-300 
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
    >
      {/* 반투명 배경 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 내용 */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4"
        onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
      >
        {children}
      </div>
    </div>
  );
}
