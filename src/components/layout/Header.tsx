import { useNavigate } from "react-router-dom";

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

  const handleClickLogo = () => {
    navigate(`/`)
  }

  const handleClickSearch = () => {
    navigate(`/search`)
  }

  return (
    <div className='flex items-center justify-between w-full h-13 p-4'>
      {showBack && <span>뒤로가기</span>}
      {showLogo && <span onClick={() => handleClickLogo()}>로고</span>}
      {title && <span>{title}</span>}
      <div className="flex gap-2">
        {showUser && <span>유저</span>}
        {showLogin && <span>로그인</span>}
        {showSearch && <span onClick={() => handleClickSearch()}>검색</span>}
        {showSettings && <span>환경설정</span>}
      </div>
    </div>
  )
}
