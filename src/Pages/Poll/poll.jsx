import { useState } from 'react'
import {
  FaCheck,
  FaHouse,
  FaSquarePollHorizontal,
  FaCircleInfo,
  FaUser,
  FaDesktop,
  FaChevronRight
} from 'react-icons/fa6';

import 'bootstrap/dist/css/bootstrap.min.css';
import './poll.css';

function Poll() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    faculdade: '',
    dias: [],
    turno: '',
    trajeto: ''
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (type === 'checkbox') {
        const updatedDias = checked
          ? [...prev.dias, value]
          : prev.dias.filter((dia) => dia !== value);
        return { ...prev, dias: updatedDias };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulário enviado com sucesso!');
    console.log(formData);
  };

  return (
    <div className="page-wrapper">
      {/* Sidebar */}
      <nav id="sidebar" className={sidebarOpen ? 'open-sidebar' : ''}>
        <div id="sidebar_content">
          <ul id="side-items">
            {[
              { icon: <FaHouse />, label: 'Início' },
              { icon: <FaSquarePollHorizontal />, label: 'Enquete', active: true },
              { icon: <FaCircleInfo />, label: 'Avisos' },
              { icon: <FaUser />, label: 'Perfil' },
              { icon: <FaDesktop />, label: 'Diretoria' }
            ].map(({ icon, label, active }) => (
              <li key={label} className={`side-item ${active ? 'active' : ''}`}>
                <a href="#">
                  {icon}
                  <span className="item-description">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <button id="open_btn" onClick={toggleSidebar}>
            <FaChevronRight id="open_btn_icon" />
          </button>
        </div>
      </nav>

      {/* Formulário */}
      <main id="form_container">
        <form id="form" onSubmit={handleSubmit}>
          <div id="input_container">
            <div id="form_header">
              <h1 id="form_title">Enquete</h1>
            </div>

            <Section
              title="Faculdade"
              name="faculdade"
              type="radio"
              options={['UNEX', 'UESC', 'Anhanguera']}
              handleChange={handleChange}
            />

            <Section
              title="Dias da semana"
              name="dia"
              type="checkbox"
              options={['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']}
              handleChange={handleChange}
            />

            <Section
              title="Turno"
              name="turno"
              type="radio"
              options={['Diurno', 'Noturno']}
              handleChange={handleChange}
            />

            <Section
              title="Tipo de trajeto"
              name="trajeto"
              type="radio"
              options={['Ida e volta', 'Só ida', 'Só volta']}
              handleChange={handleChange}
            />

            <button type="submit" className="btn-default">
              <FaCheck /> Enviar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Section({ title, name, type, options, handleChange }) {
  return (
    <div className={`${name}s`}>
      <h3>{title}</h3>
      <div className="options-group">
        {options.map((option) => {
          const id = `${name}-${option}`;
          return (
            <label key={option} htmlFor={id}>
              <input
                id={id}
                type={type}
                name={name}
                value={option}
                onChange={handleChange}
              />
              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default Poll
