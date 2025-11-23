import { useEffect, useRef, useState, type ReactNode } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(500); // 초기 높이
  const startY = useRef(0);
  const startHeight = useRef(0);
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dy = startY.current - e.clientY; // 위로 드래그 시 양수
    const newHeight = Math.max(80, Math.min(startHeight.current + dy, window.innerHeight - 50));
    setHeight(newHeight);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const dy = startY.current - e.touches[0].clientY;
    const newHeight = Math.max(80, Math.min(startHeight.current + dy, window.innerHeight - 50));
    setHeight(newHeight);
  };


  const onPointerUp = () => {
    dragging.current = false;

    const screenHeight = window.innerHeight;

    if (height > startHeight.current) {
      // 화면 높이의 90%로 설정
      setHeight(screenHeight * 1);
      return;
    }

    onClose?.(); // 닫는 이벤트 있는 경우
    setHeight(screenHeight * 0.7);
  };

  useEffect(() => {
    const screenHeight = window.innerHeight;

    setHeight(screenHeight * 0.7);
  }, [window.innerHeight])

  return (
    <div
      ref={sheetRef}
      className={`absolute -bottom-20 left-0 right-0 inset-0 z-40 transition-transform duration-300 
        ${isOpen ? "translate-y-0" : "translate-y-full"} pointer-events-none`}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg pointer-events-auto"
        style={{ height }} // 드래그 높이 반영
      >
        {/* 드래그 핸들 */}
        <div
          className="pt-2 pb-3 cursor-grab active:cursor-grabbing flex justify-center"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onPointerUp}
        >
          <div className="w-9 h-[5px] bg-surface-container-grabber rounded-full" />
        </div>

        {/* 콘텐츠 */}
        <div className="h-full pb-20">
          {children}
        </div>
      </div>
    </div>
  );
}
