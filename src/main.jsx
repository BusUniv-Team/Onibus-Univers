import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Poll from "./Pages/Poll/poll.jsx";
import Login from "./Pages/Login/login.jsx";
import Inicio from "./Pages/Inicio/inicio.jsx";
import Cadastro from "./Pages/Cadastro/index.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
