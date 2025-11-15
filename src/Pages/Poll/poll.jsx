import { useState, useEffect } from 'react';
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

// URL base do seu endpoint. SUBSTITUA pela URL REAL do seu backend
const API_BASE_URL = 'http://localhost:3000/api/poll'; 

// Função utilitária para fazer requisições fetch com JSON
async function jsonFetch(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  if (options.body && typeof options.body !== 'string') {
    defaultOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, defaultOptions);
  
  // Lida com status HTTP de erro (4xx ou 5xx)
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(`Erro na requisição: ${response.status} - ${errorBody.message || response.statusText}`);
  }

  // Retorna JSON se houver corpo de resposta, senão retorna o status OK
  if (response.headers.get("content-length") === "0" || response.status === 204) {
    return { success: true }; 
  }
  
  return response.json();
}


function Poll() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    faculdade: "", 
    dias: {
      SEG: { ativo: false, turno: "", trajeto: "" },
      TER: { ativo: false, turno: "", trajeto: "" },
      QUA: { ativo: false, turno: "", trajeto: "" },
      QUI: { ativo: false, turno: "", trajeto: "" },
      SEX: { ativo: false, turno: "", trajeto: "" },
      SÁB: { ativo: false, turno: "", trajeto: "" },
    }
  });

  /* ----------------------------------------
     FUNÇÕES PRINCIPAIS DO FORM
  -----------------------------------------*/

  // Selecionar faculdade
  const selecionarFaculdade = (value) => {
    setFormData(prev => ({
      ...prev,
      faculdade: value
    }));
  };

  // Marca/desmarca um dia
  const toggleDia = async (dia) => {
  if (!formData.faculdade) {
    alert("Selecione uma faculdade primeiro!");
    return;
  }
  
  const isActivating = !formData.dias[dia].ativo;

  // Lógica de atualização local (otimista, assumindo que a requisição terá sucesso)
  const prevAtivo = formData.dias[dia].ativo;
  setFormData(prev => {
    const ativo = !prevAtivo;
    return {
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: {
          ativo,
          turno: ativo ? prev.dias[dia].turno || "Diurno" : "", // Adicionado um valor padrão se estiver ativando
          trajeto: ativo ? prev.dias[dia].trajeto : ""
        }
      }
    };
  });

  try {
    if (isActivating) {
      // Se estiver ATIVANDO, o voto será salvo ao selecionar Turno/Trajeto ou no Submit final.
      // Aqui, apenas garantimos que a faculdade está selecionada e o estado local foi atualizado.
      return; 
    } else {
      // Se estiver DESATIVANDO, enviar um DELETE para remover o voto daquele dia
      // Você precisará de um endpoint que suporte a remoção por dia. Ex:
      // DELETE /api/poll/ID_DO_USUARIO_LOGADO/dia/SEG
      
      // OBS: Você precisará do ID do usuário logado para isso!
      const URL_DELETE = `${API_BASE_URL}/ID_DO_USUARIO_LOGADO/dia/${dia}`; 
      
      await jsonFetch(URL_DELETE, {
        method: 'DELETE',
      });
      console.log(`Voto para ${dia} removido com sucesso.`);
    }
  } catch (error) {
    console.error(`Erro ao ${isActivating ? 'adicionar' : 'remover'} voto para ${dia}:`, error);
    alert(`Falha ao atualizar voto: ${error.message}`);
    
    // Rollback do estado local em caso de falha (pode ser mais complexo dependendo da UX desejada)
    setFormData(prev => ({
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: { ...prev.dias[dia], ativo: prevAtivo }
      }
    }));
  }

  const POLL_INTERVAL = 30000; // 30 segundos (30000 milissegundos)

useEffect(() => {
  const fetchPollData = async () => {
    try {
      // Geralmente, o GET trará o estado atual da votação de todos os usuários
      // Use um endpoint específico se for trazer apenas os votos do usuário logado
      const response = await jsonFetch(`${API_BASE_URL}/current-votes`); 
      
      console.log("Dados da enquete atualizados:", response);
      // Aqui você precisaria processar 'response' e atualizar o estado 'formData'
      // Ex: setFormData(processBackendData(response));

    } catch (error) {
      console.error("Erro ao buscar dados da enquete:", error);
    }
  };

  // 1. Executa a primeira busca imediatamente
  fetchPollData(); 

  // 2. Configura o intervalo para polling
  const intervalId = setInterval(fetchPollData, POLL_INTERVAL);

  // 3. Cleanup: Limpa o intervalo quando o componente é desmontado
  return () => clearInterval(intervalId);

}, []); // O array vazio garante que o useEffect rode apenas na montagem


    setFormData(prev => {
      const ativo = !prev.dias[dia].ativo;

      return {
        ...prev,
        dias: {
          ...prev.dias,
          [dia]: {
            ativo,
            // Limpa turno e trajeto se desativar, mantém se ativar
            turno: ativo ? prev.dias[dia].turno : "",
            trajeto: ativo ? prev.dias[dia].trajeto : ""
          }
        }
      };
    });
  };

  const selecionarTurno = (dia, turno) => {
    setFormData(prev => ({
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: {
          ...prev.dias[dia],
          turno,
          trajeto: "" // limpa trajeto ao mudar turno
        }
      }
    }));
  };

  // Selecionar trajeto
  const selecionarTrajeto = (dia, trajeto) => {
    setFormData(prev => ({
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: {
          ...prev.dias[dia],
          trajeto
        }
      }
    }));
  };

  // Enviar dados para o backend
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Filtra apenas os dias ativos para envio
  const diasAtivos = Object.entries(formData.dias)
    .filter(([, info]) => info.ativo)
    .map(([dia, info]) => ({
      dia,
      turno: info.turno,
      trajeto: info.trajeto,
    }));

  const dataToSend = {
    faculdade: formData.faculdade,
    votos: diasAtivos,
    // Você provavelmente precisará adicionar um ID de usuário aqui:
    // userId: ID_DO_USUARIO_LOGADO, 
  };

  try {
    // URL para submeter todos os dados. O backend decide se é um novo voto ou atualização
    const response = await jsonFetch(API_BASE_URL, {
      method: 'POST',
      body: dataToSend,
    });

    console.log("Voto enviado/atualizado com sucesso!", response);
    alert("Enviado com sucesso!");

  } catch (error) {
    console.error("Erro ao enviar o voto:", error);
    alert(`Falha ao enviar o voto: ${error.message}`);
  }
};

  // Função da Sidebar abre e fecha
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /* ----------------------------------------
     RETURN
  -----------------------------------------*/

  return (
    <div className="poll-page">
      {/* Sidebar */}
      <nav className={`poll-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <ul className="sidebar-items">
            {[
              { icon: <FaHouse />, label: 'Início' },
              { icon: <FaSquarePollHorizontal />, label: 'Enquete', active: true },
              { icon: <FaCircleInfo />, label: 'Avisos' },
              { icon: <FaUser />, label: 'Perfil' },
              { icon: <FaDesktop />, label: 'Diretoria' }
            ].map(({ icon, label, active }) => (
              <li key={label} className={`sidebar-item ${active ? 'active' : ''}`}>
                <a href="#">
                  {icon}
                  <span className="sidebar-description">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Botão de Toggle da Sidebar (visível apenas para desktop) */}
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <FaChevronRight className="sidebar-toggle-icon" />
          </button>
        </div>
      </nav>

      {/* Form */}
      
      <main className="poll-form-container">
        <form className="poll-form" onSubmit={handleSubmit}>
          <div className="poll-input-area">
            {/* FACULDADE */}
            <h3 className="section-title">Faculdade</h3>

            <div className="faculdade-container">
              {["Anhanguera", "UNEX", "UESC"].map((fac) => (
              
                <label key={fac} className="faculdade-card">
                  <input
                  type="radio"
                  name="faculdade"
                  checked={formData.faculdade === fac}
                  onChange={() => selecionarFaculdade(fac)}
                  className="faculdade-input"
                  />
                  <span>{fac}</span>
                </label>
              ))}
            </div>


            {/* DIAS */}
            <div className="dias-container">
  {Object.keys(formData.dias).map((dia) => {
    const info = formData.dias[dia];

    return (
      <div
        key={dia}
        className={`dia-card ${info.ativo ? "active" : ""}`}
      >
        <label className="dia-top"> 
          <input
            type="checkbox"
            checked={info.ativo}
            onChange={() => toggleDia(dia)}
            className="dia-checkbox"
          />
          {dia}
        </label>

        <div className={`turno-group ${!info.ativo ? "disabled" : ""}`}>
          <label>
            <input
              type="radio"
              name={`turno-${dia}`}
              disabled={!info.ativo}
              checked={info.turno === "Diurno"}
              onChange={() => selecionarTurno(dia, "Diurno")}
            />
            Diurno
          </label>

          <label>
            <input
              type="radio"
              name={`turno-${dia}`}
              disabled={!info.ativo}
              checked={info.turno === "Noturno"}
              onChange={() => selecionarTurno(dia, "Noturno")}
            />
            Noturno
          </label>
        </div>

        <div className={`trajeto-group ${!info.turno ? "disabled" : ""}`}>
          <label>
            <input
              type="radio"
              name={`trajeto-${dia}`}
              disabled={!info.turno}
              checked={info.trajeto === "Ida e volta"}
              onChange={() => selecionarTrajeto(dia, "Ida e volta")}
            />
            Ida e volta
          </label>

          <label>
            <input
              type="radio"
              name={`trajeto-${dia}`}
              disabled={!info.turno}
              checked={info.trajeto === "Só ida"}
              onChange={() => selecionarTrajeto(dia, "Só ida")}
            />
            Só ida
          </label>

          <label>
            <input
              type="radio"
              name={`trajeto-${dia}`}
              disabled={!info.turno}
              checked={info.trajeto === "Só volta"}
              onChange={() => selecionarTrajeto(dia, "Só volta")}
            />
            Só volta
          </label>
        </div>
      </div>
    );
  })}
</div>

                     

            <button type="submit" className="poll-submit-btn">
              <FaCheck /> Salvar
            </button>

          </div>
        </form>
      </main>
    </div>
  );
}

export default Poll;