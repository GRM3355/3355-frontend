import Header from './components/layout/Header'
import './App.css'
import Nav from './components/layout/Nav'
import { Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import ChatPage from './pages/ChatPage'
import FestivalListPage from './pages/FestivalListPage'
import RoomListPage from './pages/RoomListPage'
import ConfirmModal from './components/common/ConfirmModal'
import { useConfirmStore } from './stores/useConfirmStore'
import CreateRoomPage from './pages/CreateRoomPage'
import MyChatPage from './pages/MyChatPage'
import useAuthStore from './stores/useAuthStore'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  //확인 모달용
  const { isOpen, title, message, confirmText, cancelText,
    onConfirm, onCancel, closeConfirm, } = useConfirmStore();

  //임시 토큰
  const { tempToken, setTempToken } = useAuthStore();

  // useEffect(() => {
  //   // 토큰 없으면 서버에서 발급
  //   if (!tempToken) {
  //     axios.post('/api/v1/auth/token-register', {})
  //       .then(response => {
  //         const newToken = response.data.data.accessToken;
  //         setTempToken(newToken);
  //         console.log('임시 토큰 발급 성공:', newToken);
  //       })
  //       .catch(error => {
  //         console.error('임시 토큰 발급 실패:', error);
  //       });
  //   }
  // }, [tempToken, setTempToken]);

  return (
    <div className='flex flex-col h-screen w-full sm:w-100 mx-auto relative overflow-hidden'>
      <p>{tempToken}</p>
      <Header />
      <div className='flex-1 relative w-full'>
        <div className='absolute inset-0'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/festival-list' element={<FestivalListPage />} />
            <Route path='/room-list/:id' element={<RoomListPage />} />
            <Route path='/create-room/:id' element={<CreateRoomPage />} />
            <Route path='/my-chat' element={<MyChatPage />} />
            <Route path='/chat/:id' element={<ChatPage />} />
            <Route path='/report' element={<ReportPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Nav />

      <ConfirmModal
        isOpen={isOpen}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={closeConfirm}
      />

    </div>
  )
}

export default App
