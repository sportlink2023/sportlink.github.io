import {Route, Routes} from 'react-router-dom'
import { Home, Login, SignUp, ContactUs, MyHome, CreateRoom, Room, Profil, RoomPage, Chathome, ProfilInfo } from "./exporter"

function App() {
  // effacer le AboutUs
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/myhome" element={<MyHome />} />
      <Route path="/createroom" element={<CreateRoom />} />
      <Route path="/room" element={<Room />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/roompage" element={<RoomPage />} />
      <Route path="/Chathome" element={<Chathome />} />
      <Route path="/info" element={<ProfilInfo />} />

    </Routes>
  );
}

export default App;
