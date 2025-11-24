import type { ChatAPI } from "@/types/api";
import ChatItem from "./ChatItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ChatSectionProps = {
  userId: string | undefined;
  messages: ChatAPI[];
  onScrollUp: () => void;
}

function getBubblePosition(messages: ChatAPI[], index: number) {
  const curr = messages[index];
  const prev = messages[index - 1];
  const next = messages[index + 1];

  const isPrevSameUser = prev && prev.userId === curr.userId;
  const isNextSameUser = next && next.userId === curr.userId;

  const isPrevSameTime = prev && isSameMinute(prev.createdAt, curr.createdAt);
  const isNextSameTime = next && isSameMinute(next.createdAt, curr.createdAt);

  const isPrevSame = isPrevSameUser && isPrevSameTime;
  const isNextSame = isNextSameUser && isNextSameTime;

  if (!isPrevSame && isNextSame) return "top";       // 맨 위
  else if (isPrevSame && isNextSame) return "middle"; // 중간
  else if (isPrevSame && !isNextSame) return "bottom"; // 맨 아래
  return "single"; // 혼자
}


function isSameDate(dateStr1: string, dateStr2: string) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isSameMinute(dateStr1: string, dateStr2: string) {
  if (!dateStr1 || !dateStr2) return false;

  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    d1.getHours() === d2.getHours() &&
    d1.getMinutes() === d2.getMinutes()
  );
}

export default function ChatSection({ userId, messages, onScrollUp }: ChatSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingBefore, setIsLoadingBefore] = useState(false);

  const isAtBottom = () => {
    if (!scrollRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollTop + clientHeight >= scrollHeight - 100; // 50px 오차 허용
  };

  const isAtTop = () => {
    if (!scrollRef.current) return false;

    const { scrollTop } = scrollRef.current;
    return scrollTop <= 0;
  }

  const prevScrollHeightRef = useRef(0);
  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    if (messages.length === 0) return;

    if (!isMounted) {
      scrollToBottom();
      setIsMounted(true);
      return;
    }

    if (isLoadingBefore && prevScrollHeightRef.current > 0) {
      const container = scrollRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDiff = newScrollHeight - prevScrollHeightRef.current;

      // 새로 추가된 메시지의 높이만큼 스크롤 위치 유지
      container.scrollTop += heightDiff;
      setIsLoadingBefore(false);
      prevScrollHeightRef.current = 0;
    }
  }, [messages, isMounted]);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (isAtBottom()) {
      scrollToBottom();
    }
  }, [messages, isMounted]);

  const handleScroll = () => {
    if (!isMounted) return;

    if (isAtBottom()) {
      setShowScrollDown(false);
    } else {
      setShowScrollDown(true);
    }

    if (isAtTop()) {
      // 스크롤바가 맨 위에 도달했을 때만 이전 메시지 로드
      if (!isLoadingBefore) {
        prevScrollHeightRef.current = scrollRef.current!.scrollHeight;
        setIsLoadingBefore(true);
        onScrollUp();
      }
    }
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "auto",
    });

    setShowScrollDown(false);
  };

  return (
    <>
      <div className="flex w-full h-full relative">
        <div className={`flex flex-col flex-1 overflow-y-auto p-2 scrollbar-hide`}
          ref={scrollRef} onScroll={handleScroll}>
          {messages.map((m, i) => {
            const bubblePosition = getBubblePosition(messages, i);
            const prev = messages[i - 1];
            const sameDate = prev ? isSameDate(prev.createdAt, m.createdAt) : false;

            return (<ChatItem key={m.id} chat={m} isMine={m.userId == userId}
              bubblePosition={bubblePosition}
              isSameDate={sameDate} />)
          }
          )}
        </div>
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className=" left-1/2 -translate-x-1/2 bg-surface-overlay-chip chip px-4 py-1 rounded-full 
            absolute bottom-1.5 label5-r text-basic-100 chip"
          >
            새로운 메시지로 이동
          </button>
        )}

      </div>
    </>
  )
}
