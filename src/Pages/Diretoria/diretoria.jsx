import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./diretoria.css";
import Sidebar from "../../components/SideBar/Sidebar";

// URL para salvar as rotas
const API_ROTA_SALVAR = 'http://localhost:3001/api/dashboard/definir-rota';
// URL para buscar as linhas/motoristas disponíveis
const API_LINHAS_DISPONIVEIS = 'http://localhost:3001/api/linhas/disponiveis'; 

const SECRET_PASSWORD = "272006";




/* ============================================================
    MODAL DE AUTENTICAÇÃO
============================================================ */
function AuthModal({ onLogin, onCancel, error }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };


  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal p-5 shadow">
        <h3 className="text-center mb-4 text-white">Área Restrita</h3>
        <p className="text-center text-secondary mb-4">
          Digite a senha da diretoria para acessar.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control form-control-lg mb-3"
            placeholder="Senha..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-center text-danger small mb-3">{error}</p>
          )}

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={onCancel}
            >
              Cancelar
            </button>

            <button type="submit" className="btn btn-neon-access px-4 py-2">
              Acessar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
    MODAL PRINCIPAL
============================================================ */
function ContentModal({ onClose, children }) {
  return (
    <div className="content-modal-overlay">
      <div className="content-modal shadow">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Fechar Janela de Controle"
        >
          <span>&times;</span>
        </button>

        <div className="content-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
    CONTEÚDO PRINCIPAL DA DIRETORIA
============================================================ */
function DiretoriaContent({
  turno,
  setTurno,
  listaOnibus, 
  listaFaculdades,
  onibusSelecionado,
  toggleOnibus,
  faculdadesSelecionadas,
  selecionarFaculdade,
  motoristasSelecionados,
  selecionarMotorista,
  onSalvar,
  saveStatus,
}) {
    
  // Lista única de Grupos (Ônibus)
  const gruposOnibus = [...new Set(listaOnibus.map(item => item.grupo))];
  
  // Mapeia todos os motoristas disponíveis
  const nomesCompletos = listaOnibus.map(item => ({ 
      id: item.id_linha, 
      nome: item.nome_exibicao,
      grupo: item.grupo 
  }));

  // Função auxiliar para limpar o nome (Tira "Verde 01 - " e deixa só "Marquinhos")
  const formatarNomeMotorista = (nomeCompleto) => {
      if (!nomeCompleto) return "";
      const partes = nomeCompleto.split(' - ');
      if (partes.length > 1) {
          return partes[1]; 
      }
      return nomeCompleto;
  };

  // --- NOVA LÓGICA DE FILTRO (REMOVE DUPLICATAS) ---
  // Cria uma lista onde cada nome de motorista aparece apenas uma vez
  const motoristasUnicos = [];
  const nomesVistos = new Set();

  nomesCompletos.forEach(item => {
      const nomeFormatado = formatarNomeMotorista(item.nome);
      if (!nomesVistos.has(nomeFormatado)) {
          nomesVistos.add(nomeFormatado);
          motoristasUnicos.push({
              id: item.id, // Usa o primeiro ID encontrado para esse nome
              nomeExibicao: nomeFormatado
          });
      }
  });

  // IDs de motoristas já selecionados em outros grupos
  const selectedDriverIds = Object.values(motoristasSelecionados)
    .filter(v => v !== undefined && v !== null && v !== "")
    .map(v => Number(v)); // garante number

  const isAnyBusSelected = gruposOnibus.some(
      (grupo) => onibusSelecionado[grupo]
  );
  
  const isSelectionComplete = gruposOnibus
    .filter((grupo) => onibusSelecionado[grupo])
    .every(
      (grupo) =>
        faculdadesSelecionadas[grupo] && motoristasSelecionados[grupo]
    );

  const isSaveDisabled = !turno || !isAnyBusSelected || !isSelectionComplete;

  return (
    <div className="controle-box-modal p-4">
      <h2 className="text-center text-neon mb-4">
        Painel de Controle da Diretoria
      </h2>

      {/* TURNO */}
      <div className="turno-header d-flex justify-content-around mb-4">
        <label className={`turno-opcao ${turno === "manha" ? "active" : ""}`}>
          <input
            type="radio"
            name="turno"
            value="manha"
            checked={turno === "manha"}
            onChange={() => setTurno("manha")}
          />
          <span>Manhã</span>
        </label>

        <label
          className={`turno-opcao ${turno === "noturno" ? "active" : ""}`}
        >
          <input
            type="radio"
            name="turno"
            value="noturno"
            checked={turno === "noturno"}
            onChange={() => setTurno("noturno")}
          />
          <span>Noturno</span>
        </label>
      </div>

      <div className="row mt-4">
        {/* COLUNA 1: ÔNIBUS (GRUPO) */}
        <div className="col-lg-4 col-12">
          <h5 className="titulo-secao">Selecione o ônibus (Grupo)</h5>

          {gruposOnibus.map((grupo, i) => (
            <div key={i} className="d-flex align-items-center mb-3">
              <label className="onibus-item d-flex align-items-center">
                <input
                  type="checkbox"
                  disabled={!turno}
                  checked={!!onibusSelecionado[grupo]}
                  onChange={() => toggleOnibus(grupo)}
                />
                <span className="onibus-nome ms-2">{grupo}</span>
              </label>
            </div>
          ))}
        </div>

        {/* LINHA VERTICAL */}
        <div className="col-lg-1 d-none d-lg-flex justify-content-center">
          <div className="linha-vertical"></div>
        </div>

        {/* COLUNA 2: FACULDADES */}
        <div className="col-lg-3 col-12">
          <h5 className="titulo-secao">Faculdades</h5>

          {gruposOnibus.map((grupo, i) => (
            <div key={i} className="d-flex align-items-center mb-3">
              <select
                className="form-select form-select-sm faculdade-select"
                disabled={!onibusSelecionado[grupo]}
                value={faculdadesSelecionadas[grupo] ?? ""}
                onChange={(e) =>
                  selecionarFaculdade(grupo, e.target.value)
                }
              >
                <option value="">Selecione a faculdade</option>

                {listaFaculdades.map((facul, j) => (
                  <option key={j} value={facul.toLowerCase()}> 
                    {facul}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* LINHA VERTICAL */}
        <div className="col-lg-1 d-none d-lg-flex justify-content-center">
          <div className="linha-vertical"></div>
        </div>

        {/* COLUNA 3: MOTORISTAS (AGORA SEM DUPLICATAS E COM REMOÇÃO DINÂMICA) */}
        <div className="col-lg-3 col-12">
          <h5 className="titulo-secao">Motoristas</h5>

          {gruposOnibus.map((grupo, i) => {
            // Calcula os motoristas disponíveis para este grupo
            const availableMotoristas = motoristasUnicos.filter(item => {
              // Se este item for o selecionado para ESTE grupo, deixamos disponível
              const isSelectedInThisGroup = Number(motoristasSelecionados[grupo]) === Number(item.id);

              // Se estiver selecionado em outro grupo, não mostramos
              const isSelectedElsewhere = selectedDriverIds.includes(Number(item.id)) && !isSelectedInThisGroup;

              return !isSelectedElsewhere;
            });

            return (
              <div key={i} className="d-flex align-items-center mb-3">
                <select
                  className="form-select form-select-sm faculdade-select"
                  disabled={!onibusSelecionado[grupo]}
                  value={motoristasSelecionados[grupo] ?? ""}
                  onChange={(e) =>
                    selecionarMotorista(grupo, parseInt(e.target.value))
                  }
                >
                  <option value="">Selecione o motorista</option>

                  {/* Mostra apenas os disponíveis (ou o já selecionado para o próprio grupo) */}
                  {availableMotoristas.map((item, j) => (
                      <option key={j} value={item.id}>
                        {item.nomeExibicao}
                      </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATUS DE SALVAR */}
      {saveStatus.message && (
          <p className={`text-center mt-3 ${saveStatus.type === 'error' ? 'text-danger' : 'text-success'}`}>
              {saveStatus.message}
          </p>
      )}

      {/* BOTÃO SALVAR */}
      <div className="d-flex justify-content-center mt-5">
        <button
          onClick={onSalvar}
          className="btn btn-lg btn-neon-access px-5 py-3"
          disabled={isSaveDisabled || saveStatus.type === 'loading'}
        >
          {saveStatus.type === 'loading' ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
    COMPONENTE PRINCIPAL (PÁGINA)
============================================================ */
export default function DiretoriaPage() {
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isModalPrincipalOpen, setIsModalPrincipalOpen] = useState(false);

  const [saveStatus, setSaveStatus] = useState({ type: null, message: '' });

  const navigate = useNavigate();

  // Mock dados atualizados sem o Amarelo repetido
  const dadosMockados = [
    { id_linha: 1, nome_exibicao: 'Verde 01 - Marquinhos', grupo: 'Verde 01' },
    { id_linha: 2, nome_exibicao: 'Verde 01 - Gustavo', grupo: 'Verde 01' },
    { id_linha: 3, nome_exibicao: 'Verde 02 - Adilson', grupo: 'Verde 02' },
    { id_linha: 4, nome_exibicao: 'Verde 02 - Eliseu', grupo: 'Verde 02' },
    { id_linha: 5, nome_exibicao: 'Verde 03 - Motorista Extra', grupo: 'Verde 03' },
    { id_linha: 6, nome_exibicao: 'Gran - Álvaro', grupo: 'Gran' },
    { id_linha: 7, nome_exibicao: 'Gran - Gustavo', grupo: 'Gran' },
    { id_linha: 8, nome_exibicao: 'Amarelo G - Marquinhos', grupo: 'Amarelo G' }
  ];

  const [linhasDisponiveis, setLinhasDisponiveis] = useState(dadosMockados);

  const [turno, setTurno] = useState("");
  const [onibusSelecionado, setOnibusSelecionado] = useState({});
  const [faculdadesSelecionadas, setFaculdadesSelecionadas] = useState({});
  const [motoristasSelecionados, setMotoristasSelecionados] = useState({});


  useEffect(() => {
    async function fetchLinhas() {
        try {
            const response = await fetch(API_LINHAS_DISPONIVEIS); 
            const data = await response.json();
            if (data && data.length > 0) {
              setLinhasDisponiveis(data);
            }
        } catch (error) {
            console.error("Erro ao carregar linhas (usando dados locais):", error);
        }
    }
    fetchLinhas();
  }, []); 

  const listaFaculdades = ["Unex", "Anhanguera", "Uesc"];


  function handleLogin(password) {
    if (password === SECRET_PASSWORD) {
      setAcessoLiberado(true);
      setIsModalPrincipalOpen(true);
      setLoginError("");
    } else {
      setLoginError("Senha incorreta. Tente novamente.");
    }
  }

  function toggleOnibus(grupo) {
    setOnibusSelecionado((prev) => {
      const novo = { ...prev, [grupo]: !prev[grupo] };

      if (!novo[grupo]) {
        setFaculdadesSelecionadas((prev) => {
          const copy = { ...prev };
          delete copy[grupo];
          return copy;
        });

        setMotoristasSelecionados((prev) => {
          const copy = { ...prev };
          delete copy[grupo];
          return copy;
        });
      }

      return novo;
    });
  }

  function selecionarFaculdade(grupo, faculdade) {
    setFaculdadesSelecionadas((prev) => ({
      ...prev,
      [grupo]: faculdade, 
    }));
  }

  function selecionarMotorista(grupo, id_linha) {
    setMotoristasSelecionados((prev) => ({
      ...prev,
      [grupo]: id_linha, 
    }));
  }


  async function handleSalvar() {
    const listaOnibusGrupos = [...new Set(linhasDisponiveis.map(item => item.grupo))];
    
    const alocacoes = listaOnibusGrupos
        .filter((grupo) => onibusSelecionado[grupo])
        .map((grupo) => ({
            faculdade: faculdadesSelecionadas[grupo],
            id_linha: motoristasSelecionados[grupo], 
        }))
        .filter(a => a.faculdade && a.id_linha);


    if (alocacoes.length === 0) {
        setSaveStatus({ type: 'error', message: 'Nenhuma alocação completa para salvar.' });
        return;
    }

    setSaveStatus({ type: 'loading', message: 'Salvando no servidor...' });

    try {
      for (const alocacao of alocacoes) {
          const response = await fetch(API_ROTA_SALVAR, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(alocacao), 
          });
          
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Falha ao salvar a rota ${alocacao.faculdade}: ${errorText}`);
          }
      }

      setSaveStatus({ type: 'success', message: 'Alocações salvas com sucesso!' });
      setTimeout(() => setIsModalPrincipalOpen(false), 1500); 

    } catch (error) {
      console.error("Erro ao enviar:", error);
      setSaveStatus({ type: 'error', message: `Falha ao enviar para o servidor: ${error.message}` });
    }
  }

  if (!acessoLiberado) {
    return (
      <div className="diretoria-wrapper">
        <Sidebar activePage="Diretoria" />
        <AuthModal onLogin={handleLogin} 
        error={loginError} 
        onCancel={() => navigate("/inicio")} />
      </div>
    );
  }

  return (
    <div className="diretoria-wrapper">
      <Sidebar activePage="Diretoria" />

      <div className="diretoria-container container mt-5">
        <div
          className="acesso-painel-container shadow p-4"
          onClick={() => setIsModalPrincipalOpen(true)}
        >
          <h4 className="text-center mb-0">
            Disponibilidade{" "}
            <span className="text-neon">Operacional</span>
          </h4>

          <p className="text-center text-secondary small mb-0 mt-1">
            Gerencie ônibus, faculdades e motoristas aqui.
          </p>
        </div>

        {isModalPrincipalOpen && (
          <ContentModal onClose={() => setIsModalPrincipalOpen(false)}>
            <DiretoriaContent
              turno={turno}
              setTurno={setTurno}
              listaOnibus={linhasDisponiveis}
              listaFaculdades={listaFaculdades}
              onibusSelecionado={onibusSelecionado}
              toggleOnibus={toggleOnibus}
              faculdadesSelecionadas={faculdadesSelecionadas}
              selecionarFaculdade={selecionarFaculdade}
              motoristasSelecionados={motoristasSelecionados}
              selecionarMotorista={selecionarMotorista}
              onSalvar={handleSalvar}
              saveStatus={saveStatus}
            />
          </ContentModal>
        )}
      </div>
    </div>
  );
}
