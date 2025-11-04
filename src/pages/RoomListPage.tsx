import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useState } from "react";
import { useParams } from "react-router-dom";

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

  return (
    <div className="flex flex-col h-full">
      <div>
        <p>{id}</p>
        <div className="flex gap-2">
          <p>서울 바비큐페스타</p>
          <span className="border"
            onClick={() => setShowFestivalModal(true)}>정보</span>
        </div>

        <p>페스티벌 Zone 내에서 채팅이 가능합니다.</p>
        <p>단체 채팅방 (현재 활성화된 채팅방 6개)</p>
      </div>


      <div className='flex flex-col h-full gap-4 overflow-y-auto p-4'>
        {testRoom.map(room => (
          <RoomItem room={room} />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 border">채팅방 생성</div>
      <FestivalInfoModal isOpen={isShowFestivalModal}
        onClose={() => setShowFestivalModal(false)} />
    </div>
  )
}
