import { useNavigate } from 'react-router-dom';


type RoomItemProps = {
  name: string;
}

export default function FestivalItem({ name }: RoomItemProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    // navigate(`/room-list/${id}`)
    navigate(`/room-list/1`)

  }

  return (
    <div className='flex flex-row h-16 gap-2 items-center'
      onClick={() => handleClick()}>
      <img src='/testImg.png' alt='Festival Image'
        className='h-full aspect-square rounded-full' />
      <span className='flex-1'>
        {name}
      </span>
      <span>채팅방 개수 3개</span>
    </div>
  )
}
