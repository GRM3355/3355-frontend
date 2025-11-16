import { useConfirmStore } from "@/stores/useConfirmStore";
import useLoginStore from "@/stores/useLoginStore";
import { ChevronLeft, Logout, Search, User } from "@mynaui/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

export type HeaderRoomInfo = {
  roomTitle: string;
  festivalTitle: string;
  count: number;
}

type HeaderProps = {
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
  info?: HeaderRoomInfo | null;
  showUser?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  showLeaveRoom?: boolean;
};

export default function Header({
  showBack = false,
  showLogo = false,
  title = '',
  info = null,
  showUser = false,
  showSearch = false,
  showSettings = false,
  showLeaveRoom = false,
}: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation();

  const { openConfirm, closeConfirm } = useConfirmStore();
  const { isLoggedIn, openLoginModal } = useLoginStore();

  const handleBackConfirm = () => {
    closeConfirm();
    navigate(-1)
  }

  const handleClickBack = () => {
    if (location.pathname.startsWith('/create-room')) {
      openConfirm('채팅방 만들기 취소',
        `채팅방 생성을 취소하시겠어요?
      작성하신 내용은 저장되지 않습니다.`,
        handleBackConfirm, undefined, '나가기', '취소');
    } else {
      navigate(-1);
    }
  }

  const handleClickLogo = () => {
    navigate(`/`)
  }

  const handleClickUser = () => {
    if (isLoggedIn)
      navigate(`/mypage`)
    else
      openLoginModal();
  }

  const handleClickSearch = () => {
    navigate(`/search`)
  }

  const handleClickLeave = () => {
    //TODO 방떠나는 api 연결
  }

  return (
    <div className='flex items-center justify-between w-full h-13 px-4 py-[14]'>
      {showBack && <ChevronLeft size={24} onClick={() => handleClickBack()} />}
      {showLogo && <span onClick={() => handleClickLogo()}>로고</span>}
      {title && <span className="title3-sb text-text-primary ml-2 mr-auto">{title}</span>}
      {info &&
        <div className="flex flex-col mr-auto">
          <div className="flex gap-1">
            <span>{info.roomTitle}</span>
            <span>{info.count}</span>
          </div>
          <span>{info.festivalTitle}</span>

        </div>}
      <div className="flex gap-4">
        {showUser && <User size={24} onClick={() => handleClickUser()} />}
        {showSearch && <Search size={24} onClick={() => handleClickSearch()} />}
        {showSettings && <span>환경설정</span>}
        {showLeaveRoom && <Logout size={24} />}
      </div>
    </div>
  )
}
