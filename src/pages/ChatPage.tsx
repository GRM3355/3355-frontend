import ChatItem from "@/components/chat/ChatItem";
import Header, { type HeaderRoomInfo } from "@/components/layout/Header";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatAPI } from "@/types/api";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// const tempToken = "bf7bb5bb-d975-4d23-8786-1cfd65039570";
// const roomId = "4c9a54b6-f935-44cf-bd50-5657b43d9374";

export const bubbleTestData: ChatAPI[] = [
  // --- 내 메시지 단독(single) ---
  {
    id: "1",
    chatRoomId: "room1",
    userId: "1234",
    nickname: "Me",
    content: "첫 번째 단독 메시지",
    type: "TEXT",
    createdAt: "2025-11-15T10:00:00Z",
    likeCount: 0,
    liked: false,
  },

  // --- 상대 메시지 두 개(top → bottom) ---
  {
    id: "2",
    chatRoomId: "room1",
    userId: "9999",
    nickname: "Bob",
    content: "안녕하세요!",
    type: "TEXT",
    createdAt: "2025-11-15T10:01:00Z",
    likeCount: 1,
    liked: false,
  },
  {
    id: "3",
    chatRoomId: "room1",
    userId: "9999",
    nickname: "Bob",
    content: "오늘 날씨 좋죠?",
    type: "TEXT",
    createdAt: "2025-11-15T10:01:10Z",
    likeCount: 0,
    liked: false,
  },

  // --- 내 메시지 연속 3개(top → middle → bottom) ---
  {
    id: "4",
    chatRoomId: "room1",
    userId: "1234",
    nickname: "Me",
    content: "저도 날씨 좋아서 기분 좋네요!",
    type: "TEXT",
    createdAt: "2025-11-15T10:02:00Z",
    likeCount: 5,
    liked: true,
  },
  {
    id: "5",
    chatRoomId: "room1",
    userId: "1234",
    nickname: "Me",
    content: "점심 뭐 먹을까요?",
    type: "TEXT",
    createdAt: "2025-11-15T10:02:10Z",
    likeCount: 1,
    liked: true,
  },
  {
    id: "6",
    chatRoomId: "room1",
    userId: "1234",
    nickname: "Me",
    content: "아무거나 잘 먹습니다!",
    type: "TEXT",
    createdAt: "2025-11-15T10:02:20Z",
    likeCount: 0,
    liked: false,
  },

  // --- 상대 단독 메시지(single) ---
  {
    id: "7",
    chatRoomId: "room1",
    userId: "9999",
    nickname: "Bob",
    content: "저는 샌드위치 먹고 싶어요!",
    type: "TEXT",
    createdAt: "2025-11-15T10:03:00Z",
    likeCount: 2,
    liked: true,
  },

  // --- 내 긴 메시지 단독(single) ---
  {
    id: "8",
    chatRoomId: "room1",
    userId: "1234",
    nickname: "Me",
    content:
      "좋아요! 샌드위치 먹으러 갈까요? 저는 치킨 샌드위치 좋아해요. 양상추 듬뿍!",
    type: "TEXT",
    createdAt: "2025-11-15T10:04:00Z",
    likeCount: 3,
    liked: true,
  },
];


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


  const testUserId = '1234'

  const testRoomInfo: HeaderRoomInfo = {
    roomTitle: "테스트 방",
    festivalTitle: " 테스트 축제명",
    count: 4
  }
  return (
    <>
      <Header showBack={true} info={testRoomInfo} showLeaveRoom={true} />
      <div className="flex flex-col h-full pb-16">
        <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2 scrollbar-hide">
          {/* {testChatData.map((m, i) => (
          <ChatItem key={i} chat={m} isMine={m.userId == testUserId} />
        ))} */}
          {bubbleTestData.map((chat, i) => {
            const bubblePosition = getBubblePosition(bubbleTestData, i);

            return (
              <ChatItem
                key={chat.id}
                chat={chat}
                isMine={chat.userId === testUserId}
                bubblePosition={bubblePosition}
              />
            );
          })}
        </div>
        {/* <div className="flex flex-col flex-1 overflow-y-auto border p-2 gap-2 scrollbar-hide">
        {messages.map((m, i) => (
          <ChatItem key={i} chat={m} isMine={m.userId == userId} />
        ))}
      </div> */}


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
    </>

  );
}
