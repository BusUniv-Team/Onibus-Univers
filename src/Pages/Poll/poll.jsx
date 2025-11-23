import { useState, useEffect } from 'react';
import {
  FaCheck
} from 'react-icons/fa6';
import Sidebar from "../../components/SideBar/Sidebar";

import 'bootstrap/dist/css/bootstrap.min.css';
import './poll.css';

// URL base do backend
const API_BASE_URL = 'http://localhost:3000/api/poll';


// Função utilitária para requisições JSON
async function jsonFetch(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (options.body && typeof options.body !== 'string') {
    defaultOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(`Erro na requisição: ${response.status} - ${errorBody.message || response.statusText}`);
  }

  if (response.headers.get("content-length") === "0" || response.status === 204) {
    return { success: true };
  }

  return response.json();
}

function Poll() {


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
     USE EFFECT (deve ficar aqui! Top-level)
  -----------------------------------------*/
  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await jsonFetch(`${API_BASE_URL}/current-votes`);
        console.log("Dados da enquete atualizados:", response);
      } catch (error) {
        console.error("Erro ao buscar dados da enquete:", error);
      }
    };

    fetchPollData(); // primeira chamada

    const interval = setInterval(fetchPollData, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ----------------------------------------
     FUNÇÕES DO FORM
  -----------------------------------------*/

  const selecionarFaculdade = (value) => {
    setFormData(prev => ({ ...prev, faculdade: value }));
  };

  const toggleDia = async (dia) => {
    if (!formData.faculdade) {
      alert("Selecione uma faculdade primeiro!");
      return;
    }

    const isActivating = !formData.dias[dia].ativo;
    const prevAtivo = formData.dias[dia].ativo;

    // Atualização local otimista
    setFormData(prev => {
      const ativo = !prevAtivo;
      return {
        ...prev,
        dias: {
          ...prev.dias,
          [dia]: {
            ativo,
            turno: ativo ? prev.dias[dia].turno || "Diurno" : "",
            trajeto: ativo ? prev.dias[dia].trajeto : ""
          }
        }
      };
    });

    try {
      if (!isActivating) {
        const USER_ID = 1;
        const URL_DELETE = `${API_BASE_URL}/${USER_ID}/dia/${dia}`;
        await jsonFetch(URL_DELETE, { method: 'DELETE' });
        console.log(`Voto para ${dia} removido com sucesso.`);
      }
    } catch (error) {
      console.error(`Erro ao atualizar voto:`, error);
      alert(`Falha ao atualizar voto: ${error.message}`);

      // Rollback
      setFormData(prev => ({
        ...prev,
        dias: {
          ...prev.dias,
          [dia]: { ...prev.dias[dia], ativo: prevAtivo }
        }
      }));
    }
  };

  const selecionarTurno = (dia, turno) => {
    setFormData(prev => ({
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: { ...prev.dias[dia], turno, trajeto: "" }
      }
    }));
  };

  const selecionarTrajeto = (dia, trajeto) => {
    setFormData(prev => ({
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: { ...prev.dias[dia], trajeto }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const diasAtivos = Object.entries(formData.dias)
      .filter(([, info]) => info.ativo)
      .map(([dia, info]) => ({
        dia,
        turno: info.turno,
        trajeto: info.trajeto
      }));

    const dataToSend = {
      faculdade: formData.faculdade,
      votos: diasAtivos,
    };

    try {
      const response = await jsonFetch(API_BASE_URL, {
        method: 'POST',
        body: dataToSend,
      });

      console.log("Voto enviado:", response);
      alert("Enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert(`Falha ao enviar: ${error.message}`);
    }
  };

 

  /* ----------------------------------------
     RETURN
  -----------------------------------------*/

  return (
    <div className="poll-page">
      <Sidebar activePage="Enquete" />
      <main className="poll-form-container">
        <form className="poll-form" onSubmit={handleSubmit}>
          <div className="poll-input-area">

            <h3 className="section-title">Faculdade</h3>
            <div className="faculdade-container">
              {["Anhanguera", "UNEX", "UESC"].map(fac => (
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

            <div className="dias-container">
              {Object.keys(formData.dias).map(dia => {
                const info = formData.dias[dia];

                return (
                  <div key={dia} className={`dia-card ${info.ativo ? "active" : ""}`}>
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