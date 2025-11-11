import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useState, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatRoomAPI, FestivalAPI, RoomAPI } from "@/types/api";
import Header from "@/components/layout/Header";
import AD from "@/components/common/AD";
import { Info, Plus, X } from "@mynaui/icons-react";

type RoomListSectionProps = {
  festivalData: FestivalAPI;
  roomDatas: RoomAPI[];
}

export default function RoomListSection({ festivalData, roomDatas }: RoomListSectionProps) {
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate(`/create-room/${festivalData.festivalId}`);
  }

  const handleShowInfo = (e: MouseEvent) => {
    e.stopPropagation();
    setShowFestivalModal(true)
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="py-8">
        {/* <p>{festivalId}</p> */}
        {/* <p>{data}</p> */}
        <div className="flex items-center gap-2">
          <p className="title1-sb">{festivalData.title}</p>
          <Info size={16} onClick={(e) => handleShowInfo(e)}
            className="border rounded-full border-text-primary" />
        </div>
        <p className="caption2-r text-text-tertiary">페스티벌 Zone 내에서 채팅이 가능합니다.</p>
      </div>
      <div className="flex gap-1 pb-2">
        <span className="title3-sb text-text-primary">단체 채팅방</span>
        <span className="flex-1 label5-r text-text-tertiary">{roomDatas.length}</span>
        <span>참여자순</span>
      </div>

      <div className='flex flex-col h-full gap-2 overflow-y-auto scrollbar-hide'>
        {roomDatas.map((room: RoomAPI) => (
          <RoomItem key={room.chatRoomId} room={room} />
        ))}
      </div>

      {/* <div className="absolute bottom-8 right-8 border bg-white"
              onClick={() => handleCreateRoom()}>채팅방 생성</div> */}
      <Plus className="absolute bottom-8 right-8 w-11 h-11 bg-text-brand text-text-inverse rounded-full p-1"
        onClick={() => handleCreateRoom()} />
      <FestivalInfoModal
        festivalData={festivalData}
        isOpen={isShowFestivalModal}
        onClose={() => setShowFestivalModal(false)} />

    </div>
  )
}
