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

function App() {
  const { isOpen, title, message, confirmText, cancelText,
    onConfirm, onCancel, closeConfirm, } = useConfirmStore();


  return (
    <div className='flex flex-col h-screen w-full sm:w-100 mx-auto relative'>
      <Header />
      <div className='flex-1 w-full touch-none'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/festival-list' element={<FestivalListPage />} />
          <Route path='/room-list/:id' element={<RoomListPage />} />
          <Route path='/create-room/:id' element={<CreateRoomPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/report' element={<ReportPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
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
