import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginSignup from './pages/LoginSignup';
import NaviBar from './pages/NaviBar';
import UserInfo from './pages/UserInfo';
import DoctorInfo from './pages/DoctorInfo';
import { Routes,Route } from 'react-router-dom';
import ChatInt from './pages/ChatInt';
import UserHome from './pages/UserHome';
import Login from './pages/Login';
import Signup from './pages/Signup';



function App() {
  return (
    <>
    
    <div className="container">
      <NaviBar/>
      <switch>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/LoginSignup" element={<LoginSignup />} />
      <Route path="/UserInfo" element={<UserInfo />} />
      <Route path="/DoctorInfo" element={<DoctorInfo />} />
      <Route path="/Chat" element={<ChatInt/>} />
      <Route path="/UserHome" element={<UserHome />} />
      <Route path="/Navibar" element={<NaviBar />} />
      </Routes>
      </switch>
    </div>
    </>
  );
}

export default App;
