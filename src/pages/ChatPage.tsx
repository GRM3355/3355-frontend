import ChatItem from "@/components/chat/ChatItem";
import ChatSection from "@/components/chat/ChatSection";
import Input from "@/components/common/Input";
import Header, { type HeaderRoomInfo } from "@/components/layout/Header";
import { useMessagesInfinite } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import { useConfirmStore } from "@/stores/useConfirmStore";
import type { ChatAPI } from "@/types/api";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatAPI[]>([]);
  const [message, setMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);
  const { accessToken } = useAuthStore();
  const { roomId } = useParams();
  const [userId, setUserId] = useState();
  // const { roomId: rawRoomId } = useParams();
  // const roomId = rawRoomId ? decodeURIComponent(rawRoomId) : undefined;
  const navigate = useNavigate();
  const { openConfirm, closeConfirm } = useConfirmStore();

  const { lat, lon } = useAuthStore();

  const location = useLocation();

  const { title,
    festivalTitle,
    participantCount } = location.state as HeaderRoomInfo;

  if (!roomId) return;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useMessagesInfinite(roomId);


  useEffect(() => {
    if (!roomId) return;

    const payload: any = jwtDecode(accessToken);
    console.log(payload?.sub || null);
    setUserId(payload?.sub)

    const client = new Client({
      brokerURL: "wss://ws.zony.kro.kr/chat",
      connectHeaders: {
        // Authorization: `Bearer ${tempToken}`,
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str) => console.log("STOMP DEBUG:", str),

      onConnect: () => {
        console.log(" 연결됨");

        client.publish({
          destination: `/app/chat-rooms/${roomId}/join`,
          body: JSON.stringify({ lat, lon }),
          headers: { "content-type": "application/json" },
        });

        client.subscribe(`/sub/chat-rooms/${roomId}`, (frame) => {
          console.log("서버 메시지 원본:", frame.body);
          const msg = JSON.parse(frame.body);
          console.log("파싱된 메시지:", msg);
          setMessages((prev) => [...prev, msg]);
        });

        client.subscribe('/user/queue/errors', (frame) => {
          console.error('STOMP 에러 수신:', frame.body);
          // 여기에 에러 알림 로직 추가
        });

      },
    });

    client.activate();
    stompClientRef.current = client;

    //이전대화
    refetch();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [roomId]);

  //무한 스크롤 감지
  const handleScrollUp = () => {
    // 스크롤이 최상단 근처에 도달하면 과거 메시지 로드
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (data) {
      const beforeMessage = data?.pages.flatMap(page => page.content).reverse();
      setMessages(prev => [...beforeMessage, ...prev]);
      console.log("불러옴")
    }
  }, [data]);


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

    setMessage("");
  };


  //퇴장
  const handleLeaveRoom = () => {
    if (!stompClientRef.current) return;

    stompClientRef.current.publish({
      destination: `/app/chat-rooms/${roomId}/leave`,
      body: JSON.stringify({ lat, lon }),
      headers: { "content-type": "application/json" },
    });

    closeConfirm();
    navigate("/my-chat", { replace: true });
  }

  return (
    <>
      <Header showBack={true} info={{ title, festivalTitle, participantCount }}
        onLeaveRoom={() => openConfirm('채팅방을 나가시겠어요?',
          "모든 채팅 기록이 사라집니다.",
          handleLeaveRoom, undefined, '나가기', '취소')} />
      <div className="flex flex-col h-full pb-16">
        <div className="flex-1 overflow-y-auto">
          {/* {beforeMessage && beforeMessage.map(m => (
            <p>{m.content}</p>
          ))} */}
          <ChatSection userId={userId} messages={messages} onScrollUp={handleScrollUp} />
        </div>
        <div className="px-2">
          <Input
            type="text"
            placeholder="메세지 입력"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            defaultStyle="px-4 py-2 h-10 border rounded-2 text-text-quaternary border-line-border-secondary bg-surface-container-default"
            focusStyle="px-4 py-2 h-10 border rounded-2 text-text-primary border-state-interacion-border-focus bg-surface-container-default"
            completeStyle="px-4 py-2 h-10 border rounded-2 text-text-primary border-state-interacion-border-focus bg-surface-container-default"
            disabledStyle="px-4 py-2 h-10 rounded-2 text-text-disabled bg-state-interacion-container-disabled"
            // isDisabled={accessToken == ''}
            onSend={() => sendMessage()}
            onClear={() => setMessage('')}
          />
        </div>


      </div>
    </>

  );
}
