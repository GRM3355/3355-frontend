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
import ComponentTestPage from './pages/ComponentTestPage'
import MyPage from './pages/MyPage'
import { jwtDecode } from "jwt-decode";
import KakaoLoginModal from './components/main/KakaoLoginModal'
import useLoginStore from './stores/useLoginStore'
import KakaoRedirectPage from './pages/KakaoRedirectPage'
import useCurrentLocation from './hooks/useCurrentLocation'
import KakaoLogout from './pages/KakaoLogout'
import Quit from './pages/MyQuit'
import useLocationStore from './stores/useLocationStore'

function App() {
  //확인 모달용
  const { isOpen, title, message, confirmText, cancelText,
    onConfirm, onCancel, closeConfirm, variant, } = useConfirmStore();

  const { isLoginModalOpen, closeLoginModal } = useLoginStore();

  const { setIsAllowed, setLocation } = useLocationStore();


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsAllowed();
        const { latitude, longitude } = pos.coords;
        //TODO 추후 위치 변경
        // setLocation(latitude, longitude);
        setLocation(37.5179669, 126.957047)
        //latitude: lat ?? 37.5179669,
        //longitude: lon ?? 126.957047,
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);


  return (
    <div className='flex flex-col h-dvh w-full min-w-[360px] max-w-[480px] sm:w-100 mx-auto relative overflow-hidden'
      translate='no'>
      {/* <p>{tempToken}</p> */}
      {/*<p>{userId}</p> */}
      <div className='flex-1 relative pb-18'>
        <div className='absolute inset-0'>
          <div className='flex flex-col w-full h-full '>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/festival-list' element={<FestivalListPage />} />
              <Route path='/room-list/:festivalId' element={<RoomListPage />} />
              <Route path='/create-room/:festivalId' element={<CreateRoomPage />} />
              <Route path='/my-chat' element={<MyChatPage />} />
              <Route path='/mypage' element={<MyPage />} />
              <Route path='/chat/:roomId' element={<ChatPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/kakao-redirect' element={<KakaoRedirectPage />} />
              <Route path='*' element={<NotFound />} />
              {/* <Route path='test' element={<ComponentTestPage />} /> //TODO 추후 삭제
            <Route path='/report' element={<ReportPage />} /> //제보
            <Route path='echo' element={<EchoTest />} />
            <Route path='/logout' element={<KakaoLogout />} />
            <Route path='/quit' element={<Quit />} /> */}
            </Routes>
          </div>

        </div>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        variant={variant}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={closeConfirm}
      />

      <KakaoLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal} />
    </div>
  )
}

export default App
