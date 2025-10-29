import Header from './components/layout/Header'
import './App.css'
import Nav from './components/layout/Nav'
import { Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <div className='flex flex-col h-screen w-full sm:w-100 mx-auto relative'>
      <Header />
      <div className='flex-1 w-full'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/report' element={<ReportPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Nav />
    </div>
  )
}

export default App
