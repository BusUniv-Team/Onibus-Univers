import { useState, useEffect } from "react";
import "./aviso.css";
import Sidebar from "../../components/SideBar/Sidebar";
import fundoBg from "../../assets/fundo5.jpg";
import { FaTrash, FaThumbtack } from "react-icons/fa";

// --- CONFIGURAÇÃO DO SISTEMA ---
// Mude para TRUE terminar o Backend na porta 8080
const USAR_BACKEND = false; 
const API_URL = "http://localhost:8080/avisos";

export default function Aviso() {
  const [modalAberto, setModalAberto] = useState(false);
  const [faseModal, setFaseModal] = useState("senha-criar"); 
  
  const [senha, setSenha] = useState("");
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [novoAvisoTipo, setNovoAvisoTipo] = useState("COMUNICADO");
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const [avisos, setAvisos] = useState([]);

  // --- FUNÇÃO INTELIGENTE DE BUSCAR DADOS ---
  const carregarAvisos = async () => {
    if (USAR_BACKEND) {
      // --- MODO ONLINE (BACKEND) ---
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const dados = await response.json();
          // O backend manda os dados, o React salva no estado
          setAvisos(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar avisos do servidor:", error);
      }
    } else {
      // --- MODO OFFLINE (SIMULAÇÃO) ---
      const salvos = localStorage.getItem("meusAvisos");
      if (salvos) {
        setAvisos(JSON.parse(salvos));
      } else {
        // Dados iniciais de teste se não tiver nada salvo
        setAvisos([
          {
            id: 1,
            titulo: "O sistema de avisos está online! Tudo pronto para uso.",
            data: "26/11/2025",
            autor: "Suporte",
            tipo: "COMUNICADO",
            timestamp: new Date().getTime()
          }
        ]);
      }
    }
  };

  // --- ATUALIZAÇÃO AUTOMÁTICA (POLLING) ---
  useEffect(() => {
    carregarAvisos(); // Carrega assim que a página abre

    const intervalo = setInterval(() => {
      carregarAvisos(); // Tenta atualizar a cada 5 segundos
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // --- SINCRONIA LOCAL (Só funciona se estiver no modo Offline) ---
  useEffect(() => {
    if (!USAR_BACKEND) {
      localStorage.setItem("meusAvisos", JSON.stringify(avisos));
    }
  }, [avisos]);

  // --- LÓGICA DE SEGURANÇA (SENHA) ---
  const verificarSenha = () => {
    if (senha === "071424") {
      if (faseModal === "senha-criar") {
        setFaseModal("escrever");
        setSenha("");
      } else if (faseModal === "senha-excluir") {
        confirmarExclusao();
      }
    } else {
      alert("Senha incorreta!");
    }
  };

  // --- PUBLICAR UM NOVO AVISO ---
  const handlePublicar = async () => {
    if (!novoAvisoTexto.trim()) return;

    // Tenta pegar o usuário do login, senão usa um padrão
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario_logado"));
    const idAutorReal = usuarioLogado?.id_us || 1; 

    if (USAR_BACKEND) {
      // Envia para o servidor
      try {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: novoAvisoTexto,
            tipo: novoAvisoTipo,
            id_autor: idAutorReal
          }),
        });
        carregarAvisos(); // Recarrega a lista do servidor
      } catch (error) {
        alert("Erro ao conectar com o servidor.");
      }
    } else {
      // Salva localmente
      const dataAtual = new Date();
      const novoAvisoMock = {
        id: Date.now(),
        titulo: novoAvisoTexto,
        tipo: novoAvisoTipo,
        data: dataAtual.toLocaleDateString('pt-BR'),
        timestamp: dataAtual.getTime(),
        autor: "Diretoria (Local)"
      };
      setAvisos([novoAvisoMock, ...avisos]);
    }

    fecharModal();
  };

  // --- EXCLUIR UM AVISO ---
  const solicitarExclusao = (id) => {
    setIdParaExcluir(id);
    setFaseModal("senha-excluir");
    setModalAberto(true);
    setSenha("");
  };

  const confirmarExclusao = async () => {
    if (USAR_BACKEND) {
      // Manda deletar no servidor
      try {
        await fetch(`${API_URL}/${idParaExcluir}`, {
          method: "DELETE",
        });
        carregarAvisos();
        alert("Aviso removido!");
      } catch (error) {
        alert("Erro ao excluir no servidor.");
      }
    } else {
      // Deleta localmente
      const novaLista = avisos.filter(aviso => aviso.id !== idParaExcluir);
      setAvisos(novaLista);
      alert("Aviso removido com sucesso!");
    }
    fecharModal();
  };

  const fecharModal = () => {
    setModalAberto(false);
    setSenha("");
    setNovoAvisoTexto("");
    setNovoAvisoTipo("COMUNICADO");
    setIdParaExcluir(null);
  };

  // --- FILTRO DE 24 HORAS ---
  // Nota: Quando usar Backend, o ideal é o SQL já filtrar isso, mas manter aqui é uma segurança extra
  const avisosValidos = avisos.filter(aviso => {
    // Se não tiver data de controle, mostra sempre
    if (!aviso.timestamp && !aviso.data_criacao) return true; 
    
    // Normaliza a data (funciona tanto pro mock quanto pro banco)
    const horaAviso = aviso.timestamp || new Date(aviso.data_criacao).getTime();
    const agora = new Date().getTime();
    
    // Regra: Menos de 24h (86400000ms) OU se for o aviso fixo de exemplo (id 1)
    return (agora - horaAviso) < (24 * 60 * 60 * 1000) || aviso.id === 1;
  });

  return (
    <div className="app-aviso-wrapper">
      <Sidebar activePage="aviso" />
      <div className="app-content-wrapper">
        <div className="aviso-container" style={{ backgroundImage: `url(${fundoBg})` }}>
          
          <div className="quadro-avisos">
            <header className="quadro-header">
              <h1 className="quadro-titulo">QUADRO DE AVISOS</h1>
              <button className="btn-admin" onClick={() => {
                setFaseModal("senha-criar");
                setModalAberto(true);
              }}>
                ⚙️
              </button>
            </header>

            <div className="lista-avisos">
              {avisosValidos.length > 0 ? (
                avisosValidos.map((aviso) => (
                  <div key={aviso.id_aviso || aviso.id} className={`card-aviso tipo-${aviso.tipo ? aviso.tipo.toLowerCase() : 'comunicado'}`}>
                    <div className="alfinete"><FaThumbtack /></div>
                    
                    <button 
                      className="btn-lixeira" 
                      onClick={() => solicitarExclusao(aviso.id_aviso || aviso.id)}
                      title="Excluir aviso"
                    >
                      <FaTrash />
                    </button>

                    <div className="card-header">
                      <span className="card-tipo">{aviso.tipo}</span>
                      <span className="card-data">
                        {/* Se tiver data do banco formata ela, senão usa a data local */}
                        {aviso.data_criacao 
                          ? new Date(aviso.data_criacao).toLocaleDateString('pt-BR') 
                          : (aviso.data || "Hoje")}
                      </span>
                    </div>
                    <p className="card-texto">{aviso.titulo}</p>
                    <div className="card-footer">
                      <span>Att. {aviso.nome_autor || aviso.autor || "Diretoria"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{color: 'white', textAlign: 'center'}}>Nenhum aviso ativo nas últimas 24h.</p>
              )}
            </div>
          </div>

          {/* --- MODAL (POP-UP) --- */}
          {modalAberto && (
            <div className="modal-overlay">
              <div className="modal-content">
                
                {/* ETAPA 1: SENHA (tanto pra criar quanto pra excluir) */}
                {(faseModal === "senha-criar" || faseModal === "senha-excluir") && (
                  <>
                    <h3>{faseModal === "senha-excluir" ? "Excluir Aviso" : "Área Restrita"}</h3>
                    <p>Digite a senha da diretoria:</p>
                    <input 
                      type="password" 
                      placeholder="Senha..." 
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <div className="modal-buttons">
                      <button onClick={fecharModal}>Cancelar</button>
                      <button onClick={verificarSenha} className="btn-entrar">
                        {faseModal === "senha-excluir" ? "Excluir" : "Acessar"}
                      </button>
                    </div>
                  </>
                )}

                {/* ETAPA 2: ESCREVER O AVISO */}
                {faseModal === "escrever" && (
                  <>
                    <h3>Novo Aviso (24h)</h3>
                    <label style={{textAlign:'left', display:'block', marginBottom:'5px', color:'#333'}}>Tipo:</label>
                    <select 
                      className="input-select"
                      value={novoAvisoTipo}
                      onChange={(e) => setNovoAvisoTipo(e.target.value)}
                    >
                      <option value="COMUNICADO">COMUNICADO</option>
                      <option value="URGENTE">URGENTE</option>
                      <option value="ALERTA">ALERTA</option>
                    </select>

                    <textarea 
                      className="input-aviso-texto"
                      placeholder="Escreva seu aviso aqui..."
                      rows="5"
                      value={novoAvisoTexto}
                      onChange={(e) => setNovoAvisoTexto(e.target.value)}
                    ></textarea>

                    <div className="modal-buttons">
                      <button onClick={fecharModal}>Cancelar</button>
                      <button onClick={handlePublicar} className="btn-entrar">Publicar</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}