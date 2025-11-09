import type { Festival } from '@/types';
import type { FestivalAPI } from '@/types/api';
import { useNavigate } from 'react-router-dom';


type RoomItemProps = {
  festivalData: FestivalAPI
}

export default function FestivalItem({ festivalData }: RoomItemProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/room-list/${festivalData.festivalId}`);
  }

  return (
    <div className='flex flex-row h-20 gap-3 items-center border border-gray-200 p-4 rounded-lg cursor-pointer'
      onClick={() => handleClick()}>
      <img src={festivalData.firstImage} alt='Festival Image'
        className='h-12 w-12 aspect-square rounded-full ' />
      <div className='flex flex-col'>
        <span className='flex-1'>
          {festivalData.title}
        </span>
        <div className='flex gap-1 text-gray-400'>
          <span>999</span>
          <span>진행중</span>
        </div>
      </div>


    </div>
  )
}
