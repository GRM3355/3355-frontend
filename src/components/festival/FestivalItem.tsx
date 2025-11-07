import type { Festival } from '@/types';
import { useNavigate } from 'react-router-dom';


type RoomItemProps = {
  festivalData: Festival
}

export default function FestivalItem({ festivalData }: RoomItemProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    // navigate(`/room-list/${id}`)
    navigate(`/room-list/${festivalData.id}`);
  }

  return (
    <div className='flex flex-row h-16 gap-2 items-center'
      onClick={() => handleClick()}>
      <img src={festivalData.mainImage} alt='Festival Image'
        className='h-full aspect-square rounded-full' />
      <span className='flex-1'>
        {festivalData.name}
      </span>
      <span>채팅방 개수 3개</span>
    </div>
  )
}
