import React from 'react'
import RoomItem from '../room/RoomItem'
import BottomSheet from '../common/BottomSheet'
import { useNavigate } from 'react-router-dom';

type FestivalListBottomSheetProps = {
  isShowBottomSheet: boolean;
  onHideBottomSheet: () => void;
  onShowFestivalModal: () => void;
}

export default function FestivalListBottomSheet(
  { isShowBottomSheet,
    onHideBottomSheet,
    onShowFestivalModal
  }: FestivalListBottomSheetProps
) {
  const navigate = useNavigate()

  const handleClick = () => {
    // navigate(`/room-list/${id}`)
    navigate(`/create-room/1`)

  }

  return (
    <BottomSheet
      isOpen={isShowBottomSheet}
      onClose={() => onHideBottomSheet()}
    >
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <div className='flex gap-1'>
            <p>서울 바비큐페스타</p>
            <span className='border'
              onClick={(e) => {
                e.stopPropagation();
                onShowFestivalModal();
              }}>정보</span>
            <span>&gt;</span>
          </div>
          <p>페스티벌 Zone 내에서 채팅이 가능합니다.</p>
        </div>
        <button onClick={() => handleClick()}>채팅방 생성 버튼</button>
      </div>

      <div>
        <RoomItem room='채팅방 이름' />
      </div>

    </BottomSheet>
  )
}
