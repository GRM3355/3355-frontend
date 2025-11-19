import type { ChatAPI } from "@/types/api";
import ChatItem from "./ChatItem";
import { useEffect, useRef, useState } from "react";

type ChatSectionProps = {
  userId: string | undefined;
  messages: ChatAPI[];
  onScrollUp: () => void;
}

function getBubblePosition(messages: ChatAPI[], index: number) {
  const curr = messages[index];
  const prev = messages[index - 1];
  const next = messages[index + 1];

  const isPrevSame = prev && prev.userId === curr.userId;
  const isNextSame = next && next.userId === curr.userId;

  if (!isPrevSame && isNextSame) return "top";     // 맨 위
  else if (isPrevSame && isNextSame) return "middle";   // 중간
  else if (isPrevSame && !isNextSame) return "bottom";  // 맨 아래
  return "single"; // 혼자
}


export default function ChatSection({ userId, messages, onScrollUp }: ChatSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isAtBottom = () => {
    if (!scrollRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollTop + clientHeight >= scrollHeight - 50; // 50px 오차 허용
  };

  const isAtTop = () => {
    if (!scrollRef.current) return false;

    const { scrollTop } = scrollRef.current;
    return scrollTop <= 50;
  }

  //들어오자마자 이전 대화 전부 불러오는거 방지(맨 아래에서 시작)
  useEffect(() => {
    if (!scrollRef.current) return;


  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (messages.length === 0) return;



    if (!isMounted) {
      // 처음 로딩 시 맨 아래로 이동
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "auto",
      });

      setIsMounted(true);
    }
  }, [messages]);

  const handleScroll = () => {
    if (!isMounted) return;

    if (isAtBottom()) {
      setShowScrollDown(false);
    }
    else {
      setShowScrollDown(true);
    }

    if (isAtTop())
      onScrollUp();
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    setShowScrollDown(false);
  };


  return (
    <>
      <div className="flex w-full h-full relative"
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-1 scrollbar-hide"
          ref={scrollRef} onScroll={handleScroll}>
          {messages.map((m, i) => {
            const bubblePosition = getBubblePosition(messages, i);
            return (<ChatItem key={i} chat={m} isMine={m.userId == userId} bubblePosition={bubblePosition} />)
          }
          )}
        </div>
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className=" left-1/2 -translate-x-1/2 bg-surface-overlay-chip chip px-4 py-1 rounded-full 
            absolute bottom-4 label5-r text-basic-100"
          >
            새로운 메시지로 이동
          </button>
        )}
      </div>

    </>

  )
}
