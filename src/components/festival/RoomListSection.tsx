import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useState, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatRoomAPI, FestivalAPI, RoomAPI } from "@/types/api";
import Header from "@/components/layout/Header";
import AD from "@/components/common/AD";
import { Info, Plus, X } from "@mynaui/icons-react";
import Select from "../common/Select";

type RoomListSectionProps = {
  festivalData: FestivalAPI;
  roomDatas: RoomAPI[];
}

const FILTER = [
  { key: "participant", label: "참여자순" },
  { key: "latest", label: "최신순" },
]

export default function RoomListSection({ festivalData, roomDatas }: RoomListSectionProps) {
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('participant');

  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate(`/create-room/${festivalData.festivalId}`);
  }

  const handleShowInfo = (e: MouseEvent) => {
    e.stopPropagation();
    setShowFestivalModal(true)
  }

  const filteredRooms = filter === "participant"
    ? [...roomDatas].sort((a, b) => b.participantCount - a.participantCount)
    : roomDatas;

  return (
    <div className="flex flex-col h-full p-4 pt-0">
      <div className="pb-8">
        {/* <p>{festivalId}</p> */}
        {/* <p>{data}</p> */}
        {/* <div className="flex gap-2">
          <p className="title1-sb flex-1">{festivalData.title}</p>
          <Info size={16} onClick={(e) => handleShowInfo(e)}
            className="border rounded-full border-text-primary my-1.5" />
        </div>
        <p className="caption2-r text-text-tertiary">페스티벌 Zone 내에서 채팅이 가능합니다.</p> */}
      </div>
      <div className="flex gap-1 pb-3">
        <span className="title3-sb text-text-primary">단체 채팅방</span>
        <span className="flex-1 label5-r text-text-tertiary">{roomDatas.length}</span>
        <Select
          items={FILTER}
          selected={filter}
          onSelect={setFilter}
        />
      </div>
      <div className='flex flex-col h-full gap-2 '>

        {/* <div className='flex flex-col h-full gap-2 overflow-y-auto scrollbar-hide'> */}
        {filteredRooms.map((room: RoomAPI) => (
          <RoomItem key={room.chatRoomId} room={room} />
        ))}
      </div>

      {/* <div className="absolute bottom-8 right-8 border bg-white"
              onClick={() => handleCreateRoom()}>채팅방 생성</div> */}


    </div>
  )
}
