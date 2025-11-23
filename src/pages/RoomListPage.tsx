import { useGetFestivalByFestivalId, useGetRoomsByFestivalId } from "@/hooks/useFestival";
import FestivalInfoModal from "@/components/main/FestivalInfoModal";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Info, Plus, UserSolid } from "@mynaui/icons-react";
import RoomListSection from "@/components/festival/RoomListSection";
import useLocationStore from "@/stores/useLocationStore";
import { LngLat } from "mapbox-gl";
import { useCheckLogin } from "@/hooks/useCheckLogin";
import Nav from "@/components/layout/Nav";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorPage from "./ErrorPage";



export default function RoomListPage() {
  const { festivalId } = useParams();
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { lat, lon, isAllowed } = useLocationStore();
  const checkLogin = useCheckLogin();


  const [isFixed, setIsFixed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number>(3000);


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

  useEffect(() => {
    if (isAllowed && lat && lon && festivalData) {
      const p1 = new LngLat(lon, lat);
      const p2 = new LngLat(festivalData.lon, festivalData.lat);

      const dist = p1.distanceTo(p2);
      setDistance(dist);
    }

    console.log({ festivalData });


  }, [festivalData?.festivalId, isAllowed]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;

    if (scrollTop >= 200) {
      setIsFixed(true); // 200px 이후 화면 고정
    } else {
      setIsFixed(false); // 초반은 스크롤 따라감
    }
  };



  // if (isRoomLoading || isFestivalLoading) return <LoadingSpinner />;
  if (isRoomError || isFestivalError) return <ErrorPage />;
  if (!roomDatas) return <div></div>;
  if (!festivalData) return <div></div>;

  const handleCreateRoom = () => {
    if (checkLogin())
      navigate(`/create-room/${festivalData.festivalId}`, { replace: true });
  }

  return (
    <>
      <Header showBack={true} />
      <div className='flex-1 w-full h-full relative overflow-hidden'>
        <div
          className="h-screen overflow-y-auto relative scrollbar-hide"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div
            className={`w-full h-max ${isFixed ? "sticky -top-[200px] left-0 z-10" : "relative"
              }`}
          >
            <div className="w-full aspect-square relative">
              <img
                src={festivalData.firstImage || '/testImg.png'}
                alt="축제 이미지"
                className="w-full aspect-square object-cover object-top"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/50 pointer-events-none"></div>
              <div className="absolute bottom-0 text-white p-5 pb-[30px]">
                <div className="flex items-center w-max p-1 pr-1.5 gap-1 text-text-inverse label8-b rounded-1 bg-surface-container-brand-1 ">
                  <UserSolid size={14} />
                  <p className="">{festivalData.totalParticipantCount}명 참여중</p>
                </div>
                <p className="title5-sb my-1">{festivalData.title}</p>
                <p className="label6-sb">{festivalData.eventStartDate} - {festivalData.eventEndDate}</p>
                <p className="label7-r">{festivalData.addr1}</p>
              </div>
            </div>

            <p className="label5-r text-text-tertiary bg-gray-100 px-4 py-2.5">페스티벌 Zone 내에서만 채팅 및 채팅방 생성이 가능합니다.</p>
          </div>

          <div className="min-h-[80%] pb-32">
            <RoomListSection festivalData={festivalData} roomDatas={roomDatas.content} />
          </div>
        </div >

        {(isAllowed && distance <= 500) && (<Plus className="absolute bottom-8 right-8 w-11 h-11 bg-text-brand text-text-inverse rounded-full p-1"
          onClick={() => handleCreateRoom()} />)}
        <FestivalInfoModal
          festivalData={festivalData}
          isOpen={isShowFestivalModal}
          onClose={() => setShowFestivalModal(false)} />
      </div>
      <Nav />
    </ >
  )
}