import { Routes, Route } from "react-router-dom";

// Páginas
import Poll from "./Pages/Poll/poll.jsx";
import Profile from "./Pages/Profile/profile.jsx";
import Home from "./Pages/Cadastro/index.jsx";
import Login from "./Pages/Login/login.jsx";
import Inicio from "./Pages/Inicio/inicio.jsx";
import Diretoria from "./Pages/Diretoria/diretoria.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/poll" element={<Poll />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/diretoria" element={<Diretoria />} />
      
    </Routes>
  );
}
