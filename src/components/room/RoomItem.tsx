import { useConfirmStore } from "@/stores/useConfirmStore";

type RoomItemProps = {
  room: string;
}

export default function RoomItem({ room }: RoomItemProps) {

  const { openConfirm } = useConfirmStore();

  const handleClick = () => {
    openConfirm('채팅방에 참여하시겠어요?',
      '내 채팅 목록에 채팅방이 생성됩니다.',
      handleConfirm, undefined, '확인', '취소');
  }

  const handleConfirm = () => {
    console.log("확인 클릭됨");
  }
  return (
    <div className='flex h-16 items-center border p-2 gap-2'
      onClick={() => handleClick()}>
      <img src="/testImg.png" alt="Festival Image"
        className="h-full aspect-square rounded-full" />
      <span className="flex-1">
        {room}
      </span>
      <span>현재 참여자수</span>
    </div>
  )
}
