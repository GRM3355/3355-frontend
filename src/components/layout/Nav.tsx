import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();

  return (
    <div className='flex h-16 bg-amber-100 items-center justify-between p-4 z-10'>
      <span onClick={() => navigate('/')}>지도</span>
      <span onClick={() => navigate('/festival-list')}>페스티벌 리스트</span>
      <span onClick={() => navigate('/chat')}>나의 채팅방</span>
    </div>
  )
}
