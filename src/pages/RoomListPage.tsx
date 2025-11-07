import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatRoomAPI } from "@/types/api";

const testRoom = [
  "채팅방 1",
  "채팅방 2",
  "채팅방 3",
  "채팅방 4",
  "채팅방 5",
  "채팅방 5",
  "채팅방 5",
  "채팅방 5",
  "채팅방 5",
  "채팅방 5",

];

export default function RoomListPage() {
  const { id } = useParams();
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    data: roomDatas,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomsByFestivalId(id || "");

  const {
    data: festivalData,
    isLoading: isFestivalLoading,
    isError: isFestivalError,
  } = useGetFestivalByFestivalId(id || "");

  if (isRoomLoading || isFestivalLoading) return <div>로딩 중...</div>;
  if (isRoomError || isFestivalError) return <div>에러 발생!</div>;
  if (!festivalData) return <div>축제 정보를 불러올 수 없습니다.</div>;

  const handleCreateRoom = () => {
    navigate(`/create-room/${festivalData.id}`);
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <p>{id}</p>
        {/* <p>{data}</p> */}
        <div className="flex gap-2">
          <p>{festivalData.name}</p>
          <span className="border"
            onClick={() => setShowFestivalModal(true)}>정보</span>
        </div>

        <p>페스티벌 Zone 내에서 채팅이 가능합니다.</p>
        <p>단체 채팅방 (현재 활성화된 채팅방 6개)</p>
      </div>


      <div className='flex flex-col h-full gap-4 overflow-y-auto p-4'>
        {roomDatas.map((room: ChatRoomAPI) => (
          <RoomItem key={room.chatRoomId} room={room} />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 border bg-white"
        onClick={() => handleCreateRoom()}>채팅방 생성</div>
      <FestivalInfoModal
        festivalData={festivalData}
        isOpen={isShowFestivalModal}
        onClose={() => setShowFestivalModal(false)} />

    </div>
  )
}
