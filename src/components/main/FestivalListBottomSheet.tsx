import React, { useEffect, type MouseEvent } from 'react'
import RoomItem from '../room/RoomItem'
import BottomSheet from '../common/BottomSheet'
import { useNavigate } from 'react-router-dom';
import type { Festival } from '@/types';
import { useGetRoomsByFestivalId } from '@/hooks/useFestival';
import type { ChatRoomAPI, FestivalAPI, RoomAPI } from '@/types/api';
import { ArrowRight, Info, Plus } from '@mynaui/icons-react';
import RoomListSection from '../festival/RoomListSection';

type FestivalListBottomSheetProps = {
  festivalData?: FestivalAPI;
  isShowBottomSheet: boolean;
  // onHideBottomSheet: () => void;
  onShowFestivalModal: () => void;
}

export default function FestivalListBottomSheet({
  festivalData,
  isShowBottomSheet,
  // onHideBottomSheet,
  onShowFestivalModal
}: FestivalListBottomSheetProps
) {
  const navigate = useNavigate()

  const {
    data: roomDatas,
    isLoading: isRoomLoading,
    isError: isRoomError,
    refetch
  } = useGetRoomsByFestivalId({ festivalId: festivalData?.festivalId });

  useEffect(() => {
    if (festivalData?.festivalId) refetch();
  }, [refetch, festivalData?.festivalId]);


  const handleClick = () => {
    navigate(`/room-list/${festivalData?.festivalId}`);
  }

  const handleShowInfo = (e: MouseEvent) => {
    e.stopPropagation();
    onShowFestivalModal();
  }

  if (isRoomLoading) {
    return <p>로딩 중...</p>;
  }


  const handleCreateRoom = (e: MouseEvent) => {
    e.stopPropagation();
    // if (!tempToken || !festivalId) return;

    // const id = parseInt(festivalId);
    // console.log("채팅방 생성 시도:", { festivalId, token: tempToken, roomTitle, lat, lon });
    // mutate({
    //   festivalId: id,
    //   token: tempToken,
    //   title: roomTitle,
    //   lat,
    //   lon
    // });

  }

  if (!festivalData || !roomDatas?.content) return null;

  return (
    <BottomSheet
      isOpen={isShowBottomSheet}
    // onClose={() => onHideBottomSheet()}
    >
      <div className='flex p-4 gap-2'>
        <img src={festivalData.firstImage || '/testImg.png'} alt=""
          className='w-15 h-15' />
        <div className='flex flex-col'>
          <span>9000명 참여중</span>
          <p>{festivalData.title}</p>
          <p>{festivalData.eventStartDate} - {festivalData.eventEndDate}</p>
          <span onClick={() => handleClick()}>더보러가기</span>
        </div>
      </div>
      <p className="caption2-r text-text-tertiary bg-gray-100">페스티벌 Zone 내에서만 채팅 및 채팅방 생성이 가능합니다.</p>
      <RoomListSection festivalData={festivalData} roomDatas={roomDatas.content} />
      <Plus className="absolute bottom-8 right-8 w-11 h-11 bg-text-brand text-text-inverse rounded-full p-1"
        onClick={(e) => handleCreateRoom(e)} />
    </BottomSheet>
  )
}

// <div className='flex items-center justify-between gap-4'>
// <div className='flex w-full flex-col py-8 gap-1'>
//   <div className='flex w-full gap-1 items-center'>
//     <p className='title1-sb text-text-primary'>{festivalData.title}</p>
//     <Info size={16} onClick={(e) => handleShowInfo(e)}
//       className=" border rounded-full border-text-primary " />
//     <ArrowRight className='ml-auto' />
//   </div>
//   <p className='caption2-r text-text-tertiary'>페스티벌 Zone 내에서 채팅이 가능합니다.</p>
// </div>
// {/* <button onClick={() => handleClick()}>채팅방 생성 버튼</button> */}
// </div>

// <div>
// {roomDatas?.content.map((room: RoomAPI) => (
//   <RoomItem key={room.chatRoomId} room={room} />
// ))}
// </div>