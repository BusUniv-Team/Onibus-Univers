import { Routes, Route } from "react-router-dom";

// Páginas
import Poll from "./Pages/Poll/poll.jsx";
import Home from "./Pages/Home/index.jsx";
import Login from "./Pages/Login/login.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/poll" element={<Poll />} />
    </Routes>
  );
}
