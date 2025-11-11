import type { ChatAPI } from "@/types/api"

type ChatItemProps = {
  chat: ChatAPI;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const formattedTime = new Date(chat.createdAt.split('.')[0]).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="w-[80%] flex flex-col">
      <p className="text-grayscale-800 mb-1">{chat.userId}</p>
      <div className="flex flex-row items-end gap-1">
        <p className="label2-r text-text-primary w-fit max-w-[70%] 
      bg-state-interacion-container-bubble-default rounded-4 px-2.5 py-2 
      whitespace-pre-line">
          {chat.content}
        </p>
        <span className="text-xs text-gray-400">{formattedTime}</span>
      </div>
    </div>

  )
}
