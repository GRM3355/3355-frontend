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
import { useEffect, useState } from 'react'
import axios from 'axios'
import SearchPage from './pages/SearchPage'
import EchoTest from './pages/EchoTest'
import api from './api/axios'


function App() {
  //확인 모달용
  const { isOpen, title, message, confirmText, cancelText,
    onConfirm, onCancel, closeConfirm, } = useConfirmStore();
  const [userId, setUserId] = useState<string>();

  //TODO: 로컬로 id 저장하는 거 없애고 아래 토큰 쓰기!!!
  // useEffect(() => {
  //   const storedId = localStorage.getItem("tempUserId");
  //   if (storedId && storedId !== "undefined") {
  //     setUserId(storedId);
  //     return;
  //   }

  //   fetch("http://localhost:3000/api/user")
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("임시 유저 아이디 발급:", data);
  //       localStorage.setItem("tempUserId", data.userId);
  //       setUserId(data.userId);
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  //임시 토큰
  const { tempToken, setTempToken } = useAuthStore();

  useEffect(() => {
    // 토큰 없으면 서버에서 발급
    if (!tempToken) {
      api.post('/api/v1/auth/token-register', {
        lat: "37.566826",
        lon: "126.9786567"
      },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          const newToken = response.data.data.accessToken;
          setTempToken(newToken);
          console.log('임시 토큰 발급 성공:', newToken);
          setUserId(newToken);
        })
        .catch(error => {
          console.error('임시 토큰 발급 실패:', error);
          console.error('에러 상세:', error.response?.data);
        });
    }
  }, [tempToken, setTempToken]);

  // console.log("임시 토큰:", tempToken);
  return (
    <div className='flex flex-col h-screen w-full sm:w-100 mx-auto relative overflow-hidden'>
      {/* <p>{tempToken}</p> */}
      {/*<p>{userId}</p> */}
      <div className='flex-1 relative w-full'>
        <div className='absolute inset-0'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/festival-list' element={<FestivalListPage />} />
            <Route path='/room-list/:festivalId' element={<RoomListPage />} />
            <Route path='/create-room/:festivalId' element={<CreateRoomPage />} />
            <Route path='/my-chat' element={<MyChatPage />} />
            <Route path='/chat/:roomId' element={<ChatPage />} />
            <Route path='/report' element={<ReportPage />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='echo' element={<EchoTest />} />
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
