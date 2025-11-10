import { isFestivalActive } from '@/utils/date';
import type { Festival } from '@/types';
import type { FestivalAPI } from '@/types/api';
import { User } from '@mynaui/icons-react';
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
    <div className='flex flex-row h-20 gap-3 items-center bg-surface-container-default
    border border-line-border-secondary p-4 rounded-3 cursor-pointer'
      onClick={() => handleClick()}>
      <img src={festivalData.firstImage} alt='Festival Image'
        className='h-12 w-12 aspect-square rounded-full ' />
      <div className='flex flex-col'>
        <span className='flex-1 title3-sb'>
          {festivalData.title}
        </span>
        {isActive ? (
          <div className='flex h-4 gap-1 items-center '>
            <User size={13} className='text-text-quaternary' />
            <span className='caption3-r text-text-quaternary'>999 ·</span>
            <span className='block caption3-r text-text-brand'>진행중</span>
          </div>
        ) : (
          <span className='caption3-r text-text-quaternary'>예정</span>
        )}

      </div>


    </div>
  )
}
