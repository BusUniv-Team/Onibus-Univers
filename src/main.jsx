import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Contribuição from "./Pages/Contribuição/contribuition.jsx";
import Login from "./Pages/Login/login.jsx";
import Inicio from "./Pages/Inicio/inicio.jsx";
import Cadastro from "./Pages/Cadastro/cadastro.jsx";
import Aviso from "./Pages/Aviso/aviso.jsx";
import Diretoria from "./Pages/Diretoria/diretoria.jsx";
import Financeiro from "./Pages/Financeiro/finance.jsx";
import Transparencia from "./Pages/Transparência/transparency.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
