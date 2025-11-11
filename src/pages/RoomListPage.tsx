import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import Header from "@/components/layout/Header";
import AD from "@/components/common/AD";
import { Info, Plus } from "@mynaui/icons-react";
import RoomListSection from "@/components/festival/RoomListSection";


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
      <RoomListSection festivalData={festivalData} roomDatas={roomDatas.content} />
    </>

  )
}
