import ChatItem from "@/components/chat/ChatItem";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatAPI } from "@/types/api";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatAPI[]>([]);
  const [message, setMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);
  const { tempToken } = useAuthStore();
  const { roomId } = useParams();

  useEffect(() => {
    if (!tempToken || !roomId) return;

    const client = new Client({
      brokerURL: "wss://ws.zony.kro.kr/chat",
      connectHeaders: { Authorization: `Bearer ${tempToken}` },
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP DEBUG:", str),

      onConnect: () => {
        console.log("연결됨");

        //메시지 구독
        client.subscribe(`/sub/chat-rooms/${roomId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => [...prev, msg]);
        });

        //채팅방 입장
        client.publish({
          destination: `/app/chat-rooms/${roomId}/join`,
          body: "",
        });
      },

      onDisconnect: () => {
        console.log("연결 종료");
      },
    });

    client.activate();
    stompClientRef.current = client;

    // 언마운트 시 연결 해제
    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [tempToken, roomId]); // 토큰 또는 방이 바뀔 때 재연결

  //메세지 전송
  const sendMessage = () => {
    if (!stompClientRef.current || !message.trim()) return;

    stompClientRef.current.publish({
      destination: `/app/chat-rooms/${roomId}/send`,
      body: JSON.stringify({
        userId: 'userId',
        nickname: "닉네임도 가지나?",
        content: message,
      }),
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto border p-2 gap-2 scrollbar-hide">
        {messages.map((m, i) => (
          <ChatItem key={i} chat={m} />
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
