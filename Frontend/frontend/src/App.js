import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NaviBar from './pages/NaviBar';
import UserInfo from './pages/UserInfo';
import DoctorInfo from './pages/DoctorInfo';
import { Routes,Route } from 'react-router-dom';
import ChatInt from './pages/ChatInt';
import TranscribePrototype from './pages/TranscribePrototype';
import DocHome from './pages/DocHome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PatientPastSum from './pages/PatientPastSum';



function App() {
  return (
    <div className="">
      <NaviBar/>
      <switch>
    <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/UserInfo" element={<UserInfo />} />
      <Route path="/DoctorInfo" element={<DoctorInfo />} />
      <Route path="/Chat" element={<ChatInt/>} />
      <Route path="/Navibar" element={<NaviBar />} />
      <Route path="/TranscribePrototype" element={<TranscribePrototype />} />
      <Route path='/DocHome' element={<DocHome />} />
      <Route path='PastSum' element={<PatientPastSum />} />
      </Routes>
      </switch>
    </div>
    
  );
}

export default App;
