import ChatItem from "@/components/chat/ChatItem";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatAPI } from "@/types/api";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// const tempToken = "bf7bb5bb-d975-4d23-8786-1cfd65039570";
// const roomId = "4c9a54b6-f935-44cf-bd50-5657b43d9374";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatAPI[]>([]);
  const [message, setMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);
  const { tempToken, userId } = useAuthStore();
  const { roomId: rawRoomId } = useParams();
  const roomId = rawRoomId ? decodeURIComponent(rawRoomId) : undefined;

  const { lat, lon } = useAuthStore();

  console.log("위치" + lat, lon);
  useEffect(() => {
    // if (!tempToken || !roomId) return;

    console.log(roomId);

    const client = new Client({
      brokerURL: "wss://ws.zony.kro.kr/chat",
      connectHeaders: { Authorization: `Bearer ${tempToken}` },
      // reconnectDelay: 5000, //TODO 연결확인 (테스트할때 계속 재시도해서 일단 뺌)
      debug: (str) => console.log("STOMP DEBUG:", str),

      onConnect: () => {
        console.log("연결됨");
        client.publish({
          destination: `/app/chat-rooms/${roomId}/join`,
          body: JSON.stringify({
            lat, lon
          }),
        });

        //메시지 구독
        client.subscribe(`/sub/chat-rooms/${roomId}`, (frame) => {
          console.log("Dsfdfsfsdf")
          const msg = JSON.parse(frame.body);
          console.log(msg);

          setMessages((prev) => [...prev, msg]);
        });
        // client.subscribe(`/sub/chat-rooms/${roomId}`, (frame) => {
        //   console.log("📩 /sub 수신:", frame.body);
        // });

        // client.subscribe(`/topic/chat-rooms/${roomId}`, (frame) => {
        //   console.log("📩 /topic 수신:", frame.body);
        // });

        // client.publish({
        //   destination: `/app/chat-rooms/${roomId}/join`,
        //   body: JSON.stringify({}),
        // });

        //채팅방 입장

      },

      onDisconnect: () => {
        console.log("연결 종료");
      },
    });

    // 언마운트 시 연결 해제
    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [tempToken, roomId, lat, lon]);

  //메세지 전송
  const sendMessage = () => {
    console.log("전송 시도:", {
      connected: stompClientRef.current?.connected,
      message: message.trim()
    });

    if (!stompClientRef.current || !message.trim()) {
      console.log("전송 불가");
      return;
    }

    const payload = { content: message };
    console.log("전송 payload:", payload);

    stompClientRef.current.publish({
      destination: `/app/chat-rooms/${roomId}/send`,
      body: JSON.stringify(payload),
    });

    console.log("publish 호출 완료");
    setMessage("");
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto border p-2 gap-2 scrollbar-hide">
        {messages.map((m, i) => (
          <ChatItem key={i} chat={m} isMine={m.userId == userId} />
        ))}
      </div>
      <div className="flex border-t">
        <input
          className="flex-1 p-2 border-none outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button className="bg-blue-500 text-white p-2" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}
