import ChatItem from "@/components/chat/ChatItem";

export default function ChatPage() {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="flex-1">
        <ChatItem />

      </div >
      {/* 메세지 입력 */}
      <div className="flex border p-2 gap-4">
        <input type="text"
          placeholder="메세지 입력"
          className="rounded-full bg-gray-400 flex-1"
        />
        <span>전송</span>
      </div>

    </div>
  )
}
