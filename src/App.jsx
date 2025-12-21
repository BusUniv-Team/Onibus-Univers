import { Routes, Route } from "react-router-dom";

// Páginas
import Contribuição from "./Pages/Contribuição/contribuition.jsx";
import Profile from "./Pages/Profile/profile.jsx";
import Home from "./Pages/Cadastro/cadastro.jsx";
import Login from "./Pages/Login/login.jsx";
import Inicio from "./Pages/Inicio/inicio.jsx";
import Aviso from "./Pages/Aviso/aviso.jsx";
import Diretoria from "./Pages/Diretoria/diretoria.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contribuicao" element={<Contribuição />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/aviso" element={<Aviso />} />
      <Route path="/diretoria" element={<Diretoria />} />
    </Routes>
  );
}
