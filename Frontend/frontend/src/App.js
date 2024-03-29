import logo from './logo.svg';
import './App.css';
import LoginSignup from './pages/LoginSignup';
import NavBar from './pages/NavBar';
import UserInfo from './pages/UserInfo';
import DoctorInfo from './pages/DoctorInfo';
import { Routes,Route} from 'react-router-dom';
import ChatInt from './pages/ChatInt';



function App() {
  return (
    <>
    

    <div className="container">
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/UserInfo" element={<UserInfo />} />
      <Route path="/DoctorInfo" element={<DoctorInfo />} />
      <Route path="/Chat" element={<ChatInt/>} />
      </Routes>
    </div>
    </>
  );
}

export default App;
