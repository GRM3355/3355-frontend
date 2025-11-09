import { useGetRoomsByToken } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
// import type { ChatRoom } from "@/types";
import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { id } = useParams();
  const { tempToken } = useAuthStore();
  const { data, isLoading, isError } = useGetRoomsByToken(tempToken);
  console.log("내 채팅방 목록:", data);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생!</div>;

  return (
    <div>
      {id}
      <p>채팅목록</p>
      {data?.content.map((room: RoomAPI) => (
        <div key={room.chatRoomId}>
          <p>{room.title}</p>
        </div>
      ))}
    </div>
  )
}
