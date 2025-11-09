type HeaderProps = {
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
  showLogin?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
};

export default function Header({
  showBack = false,
  showLogo = false,
  title = '',
  showLogin = false,
  showSearch = false,
  showSettings = false,
}: HeaderProps) {

  return (
    <div className='flex items-center justify-between w-full h-13 p-4'>
      {showBack && <span>뒤로가기</span>}
      {showLogo && <span>로고</span>}
      {title && <span>{title}</span>}
      <div className="flex gap-2">
        {showLogin && <span>로그인</span>}
        {showSearch && <span>검색</span>}
        {showSettings && <span>환경설정</span>}
      </div>
    </div>
  )
}
