type HeaderProps = {
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
  showSearch?: boolean;
  showSettings?: boolean;
};

export default function Header({
  showBack = false,
  showLogo = false,
  title = '',
  showSearch = false,
  showSettings = false,
}: HeaderProps) {

  return (
    <div className='flex items-center justify-between w-full h-10'>
      {showBack && <span>뒤로가기</span>}
      {showLogo && <span>로고</span>}
      {title && <span>{title}</span>}
      <div className="flex gap-2">
        {showSearch && <span>검색</span>}
        {showSettings && <span>환경설정</span>}
      </div>
    </div>
  )
}
