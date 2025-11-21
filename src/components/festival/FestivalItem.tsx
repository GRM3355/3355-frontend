import { isFestivalActive } from '@/utils/date';
import type { FestivalAPI } from '@/types/api';
import { CalendarSolid } from '@mynaui/icons-react';
import { useNavigate } from 'react-router-dom';


type RoomItemProps = {
  festivalData: FestivalAPI
}

export default function FestivalItem({ festivalData }: RoomItemProps) {
  const navigate = useNavigate()

  const isActive = isFestivalActive(festivalData.eventStartDate, festivalData.eventEndDate);

  const handleClick = () => {
    navigate(`/room-list/${festivalData.festivalId}`);
  }

  return (
    <div onClick={() => handleClick()}>
      <div className="w-40 h-40 relative rounded-3 overflow-hidden">
        <img
          src={festivalData.firstImage || '/testImg.png'}
          alt="축제 이미지"
          className="w-full h-full object-cover"
        />
        {!isActive && <div className="absolute inset-0 bg-surface-overlay-dim-modal-sheet flex items-center justify-center">
          <span className='label8-b text-white'>Coming Soon</span>
        </div>}
      </div>

      <p className='text-primary title3-sb'>{festivalData.title}</p>
      <div className='flex items-center text-icon-container-tertiary'>
        <CalendarSolid size={14} />
        <span className='caption5-r'>Date · </span>
        {isActive ? (
          <span className='caption3-r text-text-brand '>개최중</span>
        ) : (
          <span className='caption3-r text-text-quaternary'>개최예정</span>
        )}
      </div>

    </div>
  )
}
