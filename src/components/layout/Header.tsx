import { useConfirmStore } from "@/stores/useConfirmStore";
import { ChevronLeft, Search, User } from "@mynaui/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

type HeaderProps = {
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
  showUser?: boolean;
  showLogin?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
};

export default function Header({
  showBack = false,
  showLogo = false,
  title = '',
  showUser = false,
  showLogin = false,
  showSearch = false,
  showSettings = false,
}: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation();

  const { openConfirm, closeConfirm } = useConfirmStore();

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
    navigate(`/mypage`)
  }

  const handleClickSearch = () => {
    navigate(`/search`)
  }

  return (
    <div className='flex items-center justify-between w-full h-13 px-4 py-[14]'>
      {showBack && <ChevronLeft size={24} onClick={() => handleClickBack()} />}
      {showLogo && <span onClick={() => handleClickLogo()}>로고</span>}
      {title && <span className="title3-sb text-text-primary ml-2 mr-auto">{title}</span>}
      <div className="flex gap-4">
        {showUser && <User size={24} onClick={() => handleClickUser()} />}
        {showLogin && <span>로그인</span>}
        {showSearch && <Search size={24} onClick={() => handleClickSearch()} />}
        {showSettings && <span>환경설정</span>}
      </div>
    </div>
  )
}
