import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import Header from "@/components/layout/Header";
import AD from "@/components/common/AD";
import { Info, Plus } from "@mynaui/icons-react";


export default function RoomListPage() {
  const { festivalId } = useParams();
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    data: roomDatas,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomsByFestivalId({ festivalId });

  const {
    data: festivalData,
    isLoading: isFestivalLoading,
    isError: isFestivalError,
  } = useGetFestivalByFestivalId({ festivalId });

  if (isRoomLoading || isFestivalLoading) return <div>로딩 중...</div>;
  if (isRoomError || isFestivalError) return <div>에러 발생!</div>;
  if (!roomDatas) return <div>방 정보를 불러올 수 없습니다.</div>;
  if (!festivalData) return <div>축제 정보를 불러올 수 없습니다.</div>;


  const handleCreateRoom = () => {
    navigate(`/create-room/${festivalData.festivalId}`);
  }

  console
  return (
    <>
      <Header showBack={true} />
      <AD />
      <div className="flex flex-col h-full p-4">
        <div className="pb-8">
          {/* <p>{festivalId}</p> */}
          {/* <p>{data}</p> */}
          <div className="flex items-center gap-2">
            <p className="title1-sb">{festivalData.title}</p>
            <Info size={16} onClick={() => setShowFestivalModal(true)}
              className="border rounded-full border-text-primary" />
          </div>
          <p className="caption2-r text-text-tertiary">페스티벌 Zone 내에서 채팅이 가능합니다.</p>
        </div>
        <div className="flex gap-1 pb-2">
          <span className="title3-sb text-text-primary">단체 채팅방</span>
          <span className="flex-1 label5-r text-text-tertiary">{roomDatas.content.length}</span>
          <span>참여자순</span>
        </div>

        <div className='flex flex-col h-full gap-4 overflow-y-auto'>
          {roomDatas.content.map((room: RoomAPI) => (
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
    </>

  )
}
