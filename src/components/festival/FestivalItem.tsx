import { isFestivalActive } from '@/utils/date';
import type { Festival } from '@/types';
import type { FestivalAPI } from '@/types/api';
import { Calendar, CalendarSolid, User } from '@mynaui/icons-react';
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

  const mainImage = festivalData.firstImage || "/testImg.png";

  return (
    // <div className='flex flex-row h-20 gap-3 items-center bg-surface-container-default
    // border border-line-border-secondary p-4 rounded-3 cursor-pointer'
    //   onClick={() => handleClick()}>

    //   <img src={mainImage} alt='Festival Image'
    //     className='h-12 w-12 aspect-square rounded-full ' />
    //   <div className='flex flex-col'>
    //     <span className='flex-1 title3-sb'>
    //       {festivalData.title}
    //     </span>
    //     {isActive ? (
    //       <div className='flex h-4 gap-1 items-center '>
    //         <User size={13} className='text-text-quaternary' />
    //         <span className='caption3-r text-text-quaternary'>999 ·</span>
    //         <span className='block caption3-r text-text-brand'>진행중</span>
    //       </div>
    //     ) : (
    //       <span className='caption3-r text-text-quaternary'>예정</span>
    //     )}
    //   </div>
    // </div>
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
