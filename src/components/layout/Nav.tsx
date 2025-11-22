import { ChatMessagesSolid, ChatSolid, LocationHomeSolid } from '@mynaui/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex h-18 bg-white items-center justify-center z-10 border-t border-gray-200">
      <div
        onClick={() => navigate('/')}
        className={`flex-1 gap-1 cursor-pointer ${location.pathname == ('/') ? 'text-text-primary' : 'text-icon-container-tertiary'} 
        flex flex-col items-center justify-center`}
      >
        <LocationHomeSolid size={24} />
        <span className='label6-sb'>축제 현장</span>
      </div>
      <div
        onClick={() => navigate('/festival-list')}
        className={`flex-1 gap-1 cursor-pointer ${isActive('/festival-list') || isActive('/room-list') ? 'text-text-primary' : 'text-icon-container-tertiary'} 
        flex flex-col items-center justify-center`}
      >
        <ChatMessagesSolid size={24} />
        <span className='label6-sb'>축제 채팅존</span>
      </div>
      <div
        onClick={() => navigate('/my-chat')}
        className={`flex-1 gap-1 cursor-pointer ${isActive('/my-chat') ? 'text-text-primary' : 'text-icon-container-tertiary'} 
        flex flex-col items-center justify-center`}
      >
        <ChatSolid size={24} />
        <span className='label6-sb'>나의 채팅방</span>
      </div>
    </div>
  )
}
