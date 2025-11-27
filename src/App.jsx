import { Routes, Route } from "react-router-dom";

// Páginas
import Poll from "./Pages/Poll/poll.jsx";
import Profile from "./Pages/Profile/profile.jsx";
import Home from "./Pages/Cadastro/cadastro.jsx";
import Login from "./Pages/Login/login.jsx";
import Inicio from "./Pages/Inicio/inicio.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/poll" element={<Poll />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inicio" element={<Inicio />} />
    </Routes>
  );
}
