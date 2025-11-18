import type { ChatAPI } from "@/types/api";
import ChatItem from "./ChatItem";
import { useEffect, useRef, useState } from "react";

type ChatSectionProps = {
  userId: string;
  messages: ChatAPI[];
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


export default function ChatSection({ userId, messages }: ChatSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const isAtBottom = () => {
    if (!scrollRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10; // 10px 오차 허용
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    console.log("isAtBottom", isAtBottom)
    if (showScrollDown) {
      setShowScrollDown(true);
    } else {
      scrollToBottom();
    }
  }, [messages]);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    if (isAtBottom()) {
      setShowScrollDown(false);
    }
    else {
      setShowScrollDown(true);
    }
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

        <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2 scrollbar-hide"
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
            className=" left-1/2 -translate-x-1/2 bg-primar px-4 py-2 rounded-full 
            absolute bottom-4"
          >
            최신 메시지 보기
          </button>
        )}
      </div>

    </>

  )
}
