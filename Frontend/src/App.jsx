
import './App.css'
import { BrowserRouter as Router ,Route, Routes } from 'react-router-dom'
import LoginHR from './components/LoginHR'
import Navbar from './components/Navbar'
import ProfileHR from './pages/ProfileHR'
import ProfileIntern from './pages/ProfileIntern'
import AdmineLogin from './pages/AdmineLogin'
import AdmineAllLogs from './pages/AdmineAllLogs'
import LoginIntern from './components/LoginIntern'
import SigninIntern from './components/SigninIntern'


function App() {

  return (
    <>
 <Navbar/>
    <Routes>
    <Route exact path="/" element={<LoginHR />} />
    <Route path="/ProfileHR" element={<ProfileHR />} />
    <Route path="/LoginIntern" element={<LoginIntern />} />
    <Route path="/SigninIntern" element={<SigninIntern />} />
    <Route path="/ProfileIntern" element={<ProfileIntern />} />
    <Route path="/admin" element={<AdmineLogin />} />
    <Route path="/gjasdjagsfkuhaskufhas" element={<AdmineAllLogs />} />
    </Routes>

    </>
  )
}

export default App
