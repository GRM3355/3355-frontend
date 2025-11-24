import React, { useEffect, useState, type MouseEvent } from 'react'
import RoomItem from '../room/RoomItem'
import BottomSheet from '../common/BottomSheet'
import { useNavigate } from 'react-router-dom';
import type { Festival } from '@/types';
import { useGetRoomsByFestivalId } from '@/hooks/useFestival';
import type { ChatRoomAPI, FestivalAPI, RoomAPI } from '@/types/api';
import { ArrowRight, Info, Plus, UserSolid } from '@mynaui/icons-react';
import RoomListSection from '../festival/RoomListSection';
import useLocationStore from '@/stores/useLocationStore';
import { LngLat } from 'mapbox-gl';
import { useConfirmStore } from '@/stores/useConfirmStore';
import { useCheckLogin } from '@/hooks/useCheckLogin';

type FestivalListBottomSheetProps = {
  festivalData?: FestivalAPI;
  isShowBottomSheet: boolean;
  onHideBottomSheet: () => void;
  onShowFestivalModal: () => void;
}

function formatDateWithWeekday(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = days[date.getDay()];

  return `${year}.${month}.${day}(${weekday})`;
}

export default function FestivalListBottomSheet({
  festivalData,
  onHideBottomSheet,
  isShowBottomSheet,
}: FestivalListBottomSheetProps
) {
  const navigate = useNavigate()

  const { lat, lon, isAllowed } = useLocationStore();
  const [distance, setDistance] = useState<number>(3000);
  const {
    data: roomDatas,
    isLoading,
    isError,
    refetch,
    isRefetching
  } = useGetRoomsByFestivalId({ festivalId: festivalData?.festivalId });
  const { openConfirm, closeConfirm } = useConfirmStore();
  const checkLogin = useCheckLogin()

  useEffect(() => {
    if (festivalData?.festivalId) refetch();

    if (isAllowed && lat && lon && festivalData) {
      const p1 = new LngLat(lon, lat);
      const p2 = new LngLat(festivalData.lon, festivalData.lat);

      const dist = p1.distanceTo(p2);
      setDistance(dist);
      console.log(dist);
    }

  }, [refetch, festivalData?.festivalId, isAllowed]);


  const handleShowDetail = () => {
    if (festivalData)
      navigate(`/room-list/${festivalData?.festivalId}`);

  }

  useEffect(() => {
    return () => {
      closeConfirm();
    };
  }, []);

  const handleCreateRoom = (e: MouseEvent) => {
    e.stopPropagation();
    if (!roomDatas) return;

    if (!checkLogin())
      return;

    if (roomDatas.content.length >= 30) {
      openConfirm('채팅방 개설 한도 초과',
        "기존 채팅방으로 입장해 주세요.",
        closeConfirm, undefined, '확인',)
      return;
    }


    if (festivalData)
      navigate(`/create-room/${festivalData.festivalId}`, { replace: true });
  }

  if (!festivalData || !roomDatas?.content) return null;

  return (
    <BottomSheet
      isOpen={isShowBottomSheet}
      onClose={() => onHideBottomSheet()}
    >
      <div className='flex py-2 px-2.5 gap-[7px]'>
        <img src={festivalData.firstImage || '/testImg.png'} alt=""
          className='w-15 h-15' />
        <div className='flex flex-col'>
          <div className="flex items-center w-max p-1 pr-1.5 gap-1 text-text-inverse label8-b rounded-1 bg-surface-container-brand-1 ">
            <UserSolid size={14} className='' />
            <span className='label8-b text-text-inverse'>{festivalData.totalParticipantCount}명 참여중</span>
          </div>
          <p className='title1-sb text-text-primary'>{festivalData.title}</p>
          <p className='label5-r text-text-quaternary'>
            {formatDateWithWeekday(festivalData.eventStartDate)} - {formatDateWithWeekday(festivalData.eventEndDate)}</p>
          <span className='label7-r text-text-tertiary'
            onClick={() => handleShowDetail()} >더보러가기 &gt;</span>
        </div>
      </div>
      <p className="h-18px label5-r text-text-tertiary bg-gray-100 px-3 py-2">페스티벌 Zone 내에서만 채팅 및 채팅방 생성이 가능합니다.</p>
      <div className='h-full overflow-y-auto relative scrollbar-hide pb-50'>
        <RoomListSection festivalData={festivalData} roomDatas={roomDatas.content} />
      </div>
      {(isAllowed && distance <= 500) && (<Plus className="fixed bottom-30 right-4 w-[46px] h-[46px] bg-text-brand text-text-inverse rounded-full p-1 floating"
        onClick={(e) => handleCreateRoom(e)} />)}
    </BottomSheet>
  )
}