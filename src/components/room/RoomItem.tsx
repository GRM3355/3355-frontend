import { useConfirmStore } from "@/stores/useConfirmStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import { useNavigate } from "react-router-dom";

type RoomItemProps = {
  room: RoomAPI;
}

export default function RoomItem({ room }: RoomItemProps) {
  const navigate = useNavigate();

  const { openConfirm, closeConfirm } = useConfirmStore();

  const handleClick = () => {
    openConfirm('채팅방에 참여하시겠어요?',
      '내 채팅 목록에 채팅방이 생성됩니다.',
      handleConfirm, undefined, '확인', '취소');
  }

  const handleConfirm = () => {
    closeConfirm();
    navigate(`/chat/1`)
  }

  return (
    <div className='flex h-20 items-center border border-line-border-secondary p-4 gap-2 rounded-3'
      onClick={() => handleClick()}>
      <img src="/testImg.png" alt="Festival Image"
        className="h-full aspect-square rounded-full" />
      <span className="title3-sb text-text-primary">
        {room.title}
      </span>
      <span className="caption2-r text-text-quaternary">{room.participantCount}</span>
    </div>
  )
}
