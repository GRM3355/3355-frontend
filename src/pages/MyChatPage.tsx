import { useGetRoomsByUserId } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatRoomAPI } from "@/types/api";
// import type { ChatRoom } from "@/types";
import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { id } = useParams();
  const { tempToken } = useAuthStore();
  const { data, isLoading, isError } = useGetRoomsByUserId(tempToken);
  console.log("내 채팅방 목록:", data);

  return (
    <div>
      {id}
      <p>채팅목록</p>
      {data?.map((room: ChatRoomAPI) => (
        <div key={room.chatRoomId}>
          <p>{room.title}</p>
        </div>
      ))}
    </div>
  )
}
