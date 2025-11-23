import { useJoinRoom } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import { useConfirmStore } from "@/stores/useConfirmStore";
import useLocationStore from "@/stores/useLocationStore";
import useLoginStore from "@/stores/useLoginStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type RoomItemProps = {
  room: RoomAPI;
  showDetail?: boolean;
  hasNew?: boolean;
}


export default function RoomItem({ room, showDetail, hasNew }: RoomItemProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { openConfirm, closeConfirm } = useConfirmStore();
  const { accessToken } = useAuthStore();
  const { openLoginModal } = useLoginStore();

  const { mutate, isPending } = useJoinRoom(room);
  const { lat, lon } = useLocationStore();

  const [thumbnail, setThumbnail] = useState("/chat_thumbnail/1.svg");

  const handleEnterRoom = () => {
    if (!accessToken) {
      openLoginModal();
      return;
    }

    if (location.pathname == '/my-chat') {
      navigate(`/chat/${room.chatRoomId}`, {
        state: { roomInfo: room },
      });
      return;
    }

    //마이룸 아니면 참여 확인 문구 
    openConfirm('채팅방에 참여하시겠어요?',
      '내 채팅 목록에 채팅방이 생성됩니다.', handleConfirm, undefined, '확인', '취소');
  }

  const handleConfirm = () => {
    closeConfirm();

    if (!accessToken || !room.chatRoomId) return;
    mutate({
      roomId: room.chatRoomId,
      token: accessToken,
    });
  }

  const chat_thumbnails = [
    '/chat_thumbnail/1.svg',
    '/chat_thumbnail/2.svg',
    '/chat_thumbnail/3.svg',
    '/chat_thumbnail/4.svg',
    '/chat_thumbnail/5.svg',
    '/chat_thumbnail/6.svg',
    '/chat_thumbnail/7.svg',
    '/chat_thumbnail/8.svg',
  ];

  function getRandomThumbnail() {
    const index = Math.floor(Math.random() * chat_thumbnails.length);
    return chat_thumbnails[index];
  }

  useEffect(() => {
    setThumbnail(getRandomThumbnail());
  }, [])

  return (
    <>
      <div className='flex h-20 items-center border border-line-border-secondary p-4 gap-3 rounded-3'
        onClick={() => handleEnterRoom()}>
        <img src={thumbnail} alt="Festival Image"
          className="w-12 aspect-square rounded-full" />
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
        {hasNew && <span className="ml-auto w-4 h-4 flex items-center justify-center text-xs
      bg-text-brand text-text-inverse rounded-full label8-b">
          N
        </span>
        }
      </div>

    </>



  )
}
