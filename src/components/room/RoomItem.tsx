import { useConfirmStore } from "@/stores/useConfirmStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import { useLocation, useNavigate } from "react-router-dom";

type RoomItemProps = {
  room: RoomAPI;
  showDetail?: boolean;
  isNew?: boolean;
}

export default function RoomItem({ room, showDetail, isNew }: RoomItemProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { openConfirm, closeConfirm } = useConfirmStore();

  const handleClick = () => {
    if (location.pathname === '/my-chat') {
      navigate(`/chat/${room.chatRoomId}`);
      return;
    }

    openConfirm('채팅방에 참여하시겠어요?',
      '내 채팅 목록에 채팅방이 생성됩니다.', handleConfirm, undefined, '확인', '취소');

  }

  const handleConfirm = () => {
    closeConfirm();
    // navigate(`/ chat / 1`)
    navigate(`/ chat / ${room.chatRoomId}`)

  }

  // if (room.participantCount >= 30)

  return (
    <div className='flex h-20 items-center border border-line-border-secondary p-4 gap-4 rounded-3'
      onClick={() => handleClick()}>
      <img src="/testImg.png" alt="Festival Image"
        className="h-full aspect-square rounded-full" />
      <div>
        {showDetail && (
          <div>
            <p className="caption3-r text-text-tertiary">{room.festivalTitle}</p>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <span className="title3-sb text-text-primary">
            {room.title}
          </span>
          <span className="caption2-r text-text-quaternary">{room.participantCount}</span>
        </div>
      </div>
      {isNew && <span className="ml-auto w-4 h-4 flex items-center justify-center text-xs
      bg-text-brand text-text-inverse rounded-full">
        N
      </span>
      }


    </div>
  )
}
