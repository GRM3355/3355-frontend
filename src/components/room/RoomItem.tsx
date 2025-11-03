
type RoomItemProps = {
  room: string;
}

export default function RoomItem({ room }: RoomItemProps) {
  return (
    <div className='flex h-16 items-center border p-2 gap-2'>
      <img src="/testImg.png" alt="Festival Image"
        className="h-full aspect-square rounded-full" />
      <span className="flex-1">
        {room}
      </span>
      <span>현재 참여자수</span>
    </div>
  )
}
