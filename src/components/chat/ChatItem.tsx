import type { ChatAPI } from "@/types/api"
import { formatDate } from "@/utils/date";
import { LikeSolid } from "@mynaui/icons-react";
import { useRef, useState } from "react";

type ChatItemProps = {
  chat: ChatAPI;
  isMine: boolean;
  bubblePosition: "single" | "top" | "middle" | "bottom";
  isSameDate: boolean;
};

export default function ChatItem({ chat, isMine, bubblePosition, isSameDate }: ChatItemProps) {
  const formattedTime = new Date(chat.createdAt.split('.')[0]).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // long press like
  const [isLiked, setIsLiked] = useState(chat.liked);
  const timerRef = useRef<number | null>(null);

  const handlePointerDown = () => {
    timerRef.current = window.setTimeout(() => {
      setIsLiked(true);
      console.log("좋아요!");
    }, 500);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  /** 말풍선 라운드 설정 */
  const leftStyles = {
    single: "rounded-4",
    top: "rounded-4 rounded-bl-[2px]",
    middle: "rounded-4 rounded-tl-[2px] rounded-bl-[2px]",
    bottom: "rounded-4 rounded-tl-[2px]",
  };

  const rightStyles = {
    single: "rounded-4",
    top: "rounded-4 rounded-br-[2px]",
    middle: "rounded-4 rounded-tr-none rounded-br-[2px]",
    bottom: "rounded-4 rounded-tr-[2px]",
  };

  const bubbleClass = isMine ? rightStyles[bubblePosition] : leftStyles[bubblePosition];

  return (
    <>
      {!isSameDate &&
        <div className="w-full flex justify-center items-center py-2">
          <p className="w-8 h-px bg-icon-border-secondary mx-4"></p>
          <span className="text-text-quaternary caption3-r">
            {formatDate(chat.createdAt.split('T')[0])}
          </span>
          <p className="w-8 h-px bg-icon-border-secondary mx-4"></p>
        </div>
      }
      <div className={`w-[80%] flex flex-col ${isMine ? "ml-auto items-end" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}>

        {/* 닉네임 */}
        {(bubblePosition == 'single' || bubblePosition == 'top') && <p className={`label7-r
          ${isMine ? "text-text-brand" : "text-grayscale-800"}`}>
          {chat.nickname}
        </p>}

        {/* 말풍선 + 시간 */}
        <div className={`flex flex-row items-end gap-1 mb-1 w-full ${isMine ? "justify-end" : ""}`}>
          {/* 상대방: 시간 → 왼, 말풍선 → 오른쪽 */}
          {(bubblePosition === 'single' || bubblePosition === 'bottom') && isMine && (
            <span className="caption4-r text-text-quaternary">{formattedTime}</span>
          )}
          <p
            className={`
            label2-r w-fit max-w-[70%] px-2.5 py-2 whitespace-pre-line
            ${isMine ? "text-text-inverse bg-text-brand" : "text-text-primary bg-state-interacion-container-bubble-default"}
            ${bubbleClass}
          `}
          >
            {chat.content}
          </p>

          {/* 내 메시지: 시간 → 오른쪽 */}
          {(bubblePosition === 'single' || bubblePosition === 'bottom') && !isMine && (
            <span className="caption4-r text-text-quaternary">{formattedTime}</span>
          )}
        </div>

        {/* 좋아요 버튼 */}
        {(chat.likeCount > 0 || (chat.likeCount == 0 && isLiked)) && (
          <div
            className="w-max flex gap-0.5 px-0.75 py-0.5 bg-state-interacion-container-bubble-default items-center
            rounded-full">
            <LikeSolid
              size={12}
              className={isLiked ? "text-alpha-yellow-70" : "text-icon-container-tertiary"}
            />
            <span className={`${isLiked ? "text-text-brand" : "text-text-primary"} caption5-r`}>{chat.likeCount}</span>
          </div>
        )}
      </div>
      {(bubblePosition === 'single' || bubblePosition === 'bottom') && <span className="pb-4" />}
    </>

  );
}
