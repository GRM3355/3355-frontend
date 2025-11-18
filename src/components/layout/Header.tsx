import useAuthStore from "@/stores/useAuthStore";
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

  const { setTempToken, setUserId, userId } = useAuthStore();

  const handleTestUser = (n: number) => {
    if (n == 1) {
      console.log("현재 테스트 유저: 1");
      setTempToken('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMDFfa2FrYW8iLCJpYXQiOjE3NjMzODAwMzQsImV4cCI6MTc2MzQ2NjQzNCwiYXV0aCI6IlVTRVIifQ.8DXXEph42xZeim_Tt-nRmPA79u9eFTPU9Q8zCXMGa09MMB5wZpBWyPTH7b14QcbRcllpRUWh-KFZfeY8yqQG2Q');
      setUserId('1234');
    }
    else {
      console.log("현재 테스트 유저: 2");
      setTempToken('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMDFfa2FrYW8iLCJpYXQiOjE3NjMzODAwODEsImV4cCI6MTc2MzQ2NjQ4MSwiYXV0aCI6IlVTRVIifQ.-aEyFGjw16r32z_WP8iFnmpWomfN6RN3ZbZjhiuPyAUvdRN7s5pY8S6WvFShEyCDOevVrXCGVzaHbl8OAK29fA');
      setUserId('5678');
    }

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
      <span onClick={() => handleTestUser(1)}>1</span>
      <span onClick={() => handleTestUser(2)}>2</span>
      <span>{userId}</span>
    </div>
  )
}
