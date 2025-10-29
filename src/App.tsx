import Header from './components/layout/Header'
import './App.css'
import Nav from './components/layout/Nav'
import { Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import ChatListPage from './pages/ChatListPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <div className='flex flex-col h-screen w-full sm:w-100 mx-auto relative'>
      <Header />
      <div className='flex-1 w-full'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/chat-list' element={<ChatListPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/report' element={<ReportPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Nav />
    </div>
  )
}

export default App
