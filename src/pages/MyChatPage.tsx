import Header from "@/components/layout/Header";
import { useGetRoomsByToken } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
// import type { ChatRoom } from "@/types";
import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { tempToken } = useAuthStore();
  const { data, isLoading, isError } = useGetRoomsByToken({ token: tempToken });
  console.log("내 채팅방 목록:", data);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생!</div>;

  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <div className="w-full h-full">
        {data?.content.length ? (
          <div>
            {data?.content.map((room: RoomAPI) => (
              <div key={room.chatRoomId}>
                <p>{room.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center">
            <p>현재 참여중인 방이 없습니다.</p>
          </div>
        )}

      </div>
    </>

  )
}
