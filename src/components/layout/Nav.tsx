import { useLocation, useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-16 bg-white items-center justify-between p-4 z-10 border-t border-gray-200">
      <span
        onClick={() => navigate('/')}
        className={`cursor-pointer ${isActive('/') ? 'text-blue-500 font-semibold' : 'text-gray-700'}`}
      >
        지도
      </span>
      <span
        onClick={() => navigate('/festival-list')}
        className={`cursor-pointer ${isActive('/festival-list') ? 'text-blue-500 font-semibold' : 'text-gray-700'}`}
      >
        페스티벌 리스트
      </span>
      <span
        onClick={() => navigate('/my-chat')}
        className={`cursor-pointer ${isActive('/my-chat') ? 'text-blue-500 font-semibold' : 'text-gray-700'}`}
      >
        나의 채팅방
      </span>
    </div>
  )
}
