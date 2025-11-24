import useAuthStore from "@/stores/useAuthStore";
import { useConfirmStore } from "@/stores/useConfirmStore";
import useLoginStore from "@/stores/useLoginStore";
import { ChevronLeft, Logout, Search, User } from "@mynaui/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

export type HeaderRoomInfo = {
  title: string;
  festivalTitle: string;
  participantCount: number;
}

type HeaderProps = {
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
  info?: HeaderRoomInfo | null;
  showUser?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  onLeaveRoom?: () => void;
};

export default function Header({
  showBack = false,
  showLogo = false,
  title = '',
  info = null,
  showUser = false,
  showSearch = false,
  showSettings = false,
  onLeaveRoom
}: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation();

  const { openConfirm, closeConfirm } = useConfirmStore();
  const { openLoginModal } = useLoginStore();
  const { accessToken } = useAuthStore();

  const handleBackConfirm = () => {
    closeConfirm();
    navigate(-1)
  }

  const handleClickBack = () => {
    if (location.pathname.startsWith('/create-room')) {
      openConfirm('채팅방 만들기 취소',
        `채팅방 생성을 취소하시겠어요?
      작성하신 내용은 저장되지 않습니다.`,
        handleBackConfirm, undefined, '나가기', '취소', 'error');
    } else {
      navigate(-1);
    }
  }

  const handleClickLogo = () => {
    navigate(`/`)
  }

  const handleClickUser = () => {
    console.log("### accessToken", accessToken)
    if (accessToken)
      navigate(`/mypage`)
    else
      openLoginModal();
  }

  const handleClickSearch = () => {
    navigate(`/search`)
  }

  return (
    <div className='flex items-center justify-between w-full h-16 px-2.5 py-[9px] bg-white'>
      {showBack && <ChevronLeft size={40} onClick={() => handleClickBack()} className="p-2" />}
      {showLogo && <div className="flex gap-1.5 items-center" onClick={() => handleClickLogo()}>
        <img src="/ZonyLogo.svg" alt="" />
        <span className="label1-sb">Zony</span>
      </div>
      }
      {title && <span className="title3-sb text-text-primary ml-2 mr-auto">{title}</span>}
      {info &&
        <div className="flex flex-col mr-auto">
          <div className="flex gap-1">
            <span className="title3-sb text-text-primary">{info.title}</span>
            <span className="title3-sb text-text-tertiary">{info.participantCount}</span>
          </div>
          <span className="caption3-r text-text-primary">{info.festivalTitle}</span>

        </div>}
      <div className="flex">
        {showUser && <User size={40} onClick={() => handleClickUser()} className="p-2" />}
        {showSearch && <Search size={40} onClick={() => handleClickSearch()} className="p-2" />}
        {showSettings && <span>환경설정</span>}
        {onLeaveRoom && <Logout size={40} className="p-2"
          onClick={() => onLeaveRoom()} />}
      </div>
    </div>
  )
}
