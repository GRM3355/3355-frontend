import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import RoomItem from "@/components/room/RoomItem";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import Header from "@/components/layout/Header";
import AD from "@/components/common/AD";
import { Info, Plus, UserSolid } from "@mynaui/icons-react";
import RoomListSection from "@/components/festival/RoomListSection";


export default function RoomListPage() {
  const { festivalId } = useParams();
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isFixed, setIsFixed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;

    if (scrollTop >= 200) {
      setIsFixed(true); // 200px 이후 화면 고정
    } else {
      setIsFixed(false); // 초반은 스크롤 따라감
    }
  };

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
    navigate(`/create-room/${festivalData.festivalId}`, { replace: true });
  }

  return (
    <>
      <Header showBack={true} />
      <div
        className="h-screen overflow-y-auto relative scrollbar-hide"
        ref={scrollRef}
        onScroll={handleScroll}
      >

        <div
          className={`w-full h-max ${isFixed ? "sticky -top-[200px] left-0 z-10" : "relative"
            }`}
        >
          <div className="w-full aspect-squar relative">
            <img
              src={festivalData.firstImage || '/testImg.png'}
              alt="축제 이미지"
              className="w-full aspect-square object-cover object-top"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/50 pointer-events-none"></div>
            <div className="absolute bottom-0 text-white p-3">
              <div className="flex items-center w-max p-1 gap-1 text-text-inverse label8-b rounded-1 bg-surface-container-brand-1 ">
                <UserSolid size={12} />
                <p className="">{festivalData.totalParticipantCount}명 참여중</p>

              </div>
              <p className="text-4xl my-2">{festivalData.title}</p>
              <p className="label6-sb">{festivalData.eventStartDate} - {festivalData.eventEndDate}</p>
              <p className="label7-r">{festivalData.addr1}</p>
            </div>
          </div>

          <p className="label5-r text-text-tertiary bg-gray-100 px-3 py-2">페스티벌 Zone 내에서만 채팅 및 채팅방 생성이 가능합니다.</p>
        </div>

        <div className="min-h-[80%] pb-32">
          <RoomListSection festivalData={festivalData} roomDatas={roomDatas.content} />
        </div>
      </div >
      <Plus className="absolute bottom-8 right-8 w-11 h-11 bg-text-brand text-text-inverse rounded-full p-1"
        onClick={() => handleCreateRoom()} />
      <FestivalInfoModal
        festivalData={festivalData}
        isOpen={isShowFestivalModal}
        onClose={() => setShowFestivalModal(false)} />
    </ >
  )
}