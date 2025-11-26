import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FaHouse,
  FaSquarePollHorizontal,
  FaCircleInfo,
  FaUser,
  FaDesktop,
  FaChevronRight
} from 'react-icons/fa6';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const location = useLocation();

  const menuItems = [
    { icon: <FaHouse />, label: 'inicio', link: '/inicio' },
    { icon: <FaSquarePollHorizontal />, label: 'Enquete', link: '/Poll' },
    { icon: <FaCircleInfo />, label: 'Aviso', link: '/aviso' },
    { icon: <FaUser />, label: 'Perfil', link: '/Profile' },
    { icon: <FaDesktop />, label: 'Diretoria', link: '/' }
  ];

  return (
    <div className="app-sidebar-wrapper">

      {/* --- AQUI FICA A SIDEBAR FIXA --- */}
      <nav className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <ul className="sidebar-items">
            {menuItems.map(({ icon, label, link }) => {
              const isActive = location.pathname === link;

              return (
                <li
                  key={label}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <Link to={link}>
                    {icon}
                    <span className="sidebar-description">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <FaChevronRight className="sidebar-toggle-icon" />
          </button>
        </div>
      </nav>

      {/* --- AQUI FICA O CONTEÚDO DA PÁGINA --- */}
      <div className="app-content-wrapper">
      </div>

    </div>
  );
}

export default Sidebar;
