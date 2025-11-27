import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./diretoria.css";
import Sidebar from "../../components/SideBar/Sidebar";

// Senha estática de exemplo. Em um app real, isso usaria um backend/autenticação.
const SECRET_PASSWORD = "272006";

/* ============================================================
    MODAL DE AUTENTICAÇÃO
============================================================ */
function AuthModal({ onLogin, error }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal p-5 shadow">
        <h3 className="text-center mb-4">Área Restrita</h3>
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
              onClick={() => console.log("Acesso à Diretoria cancelado.")}
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
    MODAL PRINCIPAL (JANELA COM O CONTEÚDO)
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
    CONTEÚDO PRINCIPAL DA DIRETORIA (DENTRO DO MODAL)
============================================================ */
function DiretoriaContent({
  turno,
  setTurno,
  listaOnibus,
  listaFaculdades,
  listaMotoristas,
  onibusSelecionado,
  toggleOnibus,
  faculdadesSelecionadas,
  selecionarFaculdade,
  motoristasSelecionados,
  selecionarMotorista,
  onSalvar,
}) {
  const isAnyBusSelected = Object.keys(onibusSelecionado).some(
    (key) => onibusSelecionado[key]
  );

  const isSelectionComplete = listaOnibus
    .filter((onibus) => onibusSelecionado[onibus])
    .every(
      (onibus) =>
        faculdadesSelecionadas[onibus] && motoristasSelecionados[onibus]
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
        {/* COLUNA ÔNIBUS */}
        <div className="col-lg-4 col-12">
          <h5 className="titulo-secao">Selecione o ônibus</h5>

          {listaOnibus.map((onibus, i) => (
            <div key={i} className="d-flex align-items-center mb-3">
              <label className="onibus-item d-flex align-items-center">
                <input
                  type="checkbox"
                  disabled={!turno}
                  checked={!!onibusSelecionado[onibus]}
                  onChange={() => toggleOnibus(onibus)}
                />
                <span className="onibus-nome ms-2">{onibus}</span>
              </label>
            </div>
          ))}
        </div>

        {/* LINHA VERTICAL */}
        <div className="col-lg-1 d-none d-lg-flex justify-content-center">
          <div className="linha-vertical"></div>
        </div>

        {/* COLUNA FACULDADES */}
        <div className="col-lg-3 col-12">
          <h5 className="titulo-secao">Faculdades</h5>

          {listaOnibus.map((onibus, i) => (
            <div key={i} className="d-flex align-items-center mb-3">
              <select
                className="form-select form-select-sm faculdade-select"
                disabled={!onibusSelecionado[onibus]}
                value={faculdadesSelecionadas[onibus] ?? ""}
                onChange={(e) =>
                  selecionarFaculdade(onibus, e.target.value)
                }
              >
                <option value="">Selecione a faculdade</option>

                {listaFaculdades.map((facul, j) => (
                  <option key={j} value={facul}>
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

        {/* COLUNA MOTORISTAS */}
        <div className="col-lg-3 col-12">
          <h5 className="titulo-secao">Motoristas</h5>

          {listaOnibus.map((onibus, i) => (
            <div key={i} className="d-flex align-items-center mb-3">
              <select
                className="form-select form-select-sm faculdade-select"
                disabled={!onibusSelecionado[onibus]}
                value={motoristasSelecionados[onibus] ?? ""}
                onChange={(e) =>
                  selecionarMotorista(onibus, e.target.value)
                }
              >
                <option value="">Selecione o motorista</option>

                {listaMotoristas.map((mot, j) => (
                  <option key={j} value={mot}>
                    {mot}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="d-flex justify-content-center mt-5">
        <button
          onClick={onSalvar}
          className="btn btn-lg btn-neon-access px-5 py-3"
          disabled={isSaveDisabled}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

/* ============================================================
    COMPONENTE PRINCIPAL
============================================================ */
export default function DiretoriaPage() {
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isModalPrincipalOpen, setIsModalPrincipalOpen] = useState(false);

  const [turno, setTurno] = useState("");
  const [onibusSelecionado, setOnibusSelecionado] = useState({});
  const [faculdadesSelecionadas, setFaculdadesSelecionadas] = useState({});
  const [motoristasSelecionados, setMotoristasSelecionados] = useState({});

  const listaOnibus = [
    "Verde 01",
    "Verde 02",
    "Verde 03",
    "Granmicro",
    "Amarelinho G",
  ];

  const listaFaculdades = ["Unex", "Anhanguera", "Uesc"];
  const listaMotoristas = [
    "Marquinhos",
    "Álvaro",
    "Adilson",
    "Gustavo",
    "Elizeu"
  ];

  function handleLogin(password) {
    if (password === SECRET_PASSWORD) {
      setAcessoLiberado(true);
      setLoginError("");
    } else {
      setLoginError("Senha incorreta. Tente novamente.");
    }
  }

  function toggleOnibus(onibus) {
    setOnibusSelecionado((prev) => {
      const novo = { ...prev, [onibus]: !prev[onibus] };

      if (!novo[onibus]) {
        setFaculdadesSelecionadas((prev) => {
          const copy = { ...prev };
          delete copy[onibus];
          return copy;
        });

        setMotoristasSelecionados((prev) => {
          const copy = { ...prev };
          delete copy[onibus];
          return copy;
        });
      }

      return novo;
    });
  }

  function selecionarFaculdade(onibus, faculdade) {
    setFaculdadesSelecionadas((prev) => ({
      ...prev,
      [onibus]: faculdade,
    }));
  }

  function selecionarMotorista(onibus, motorista) {
    setMotoristasSelecionados((prev) => ({
      ...prev,
      [onibus]: motorista,
    }));
  }

  /* ============================================================
      🔥 AQUI ESTÁ O NOVO handleSalvar COM FETCH 🔥
  ============================================================ */
  async function handleSalvar() {
    const onibusAtivos = listaOnibus.filter((o) => onibusSelecionado[o]);

    const alocacoes = onibusAtivos.map((o) => ({
      onibus: o,
      faculdade: faculdadesSelecionadas[o] || null,
      motorista: motoristasSelecionados[o] || null,
    }));

    const payload = {
      turno,
      alocacoes,
    };

    try {
      const resposta = await fetch("http://localhost:3001/salvar-alocacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const retorno = await resposta.json();

      if (retorno.sucesso) {
        alert("Dados salvos com sucesso!");
      } else {
        alert("Erro ao salvar os dados.");
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Falha ao enviar para o servidor.");
    }
  }

  /* ============================================================
      RENDERIZAÇÃO
  ============================================================ */

  if (!acessoLiberado) {
    return (
      <div className="diretoria-wrapper">
        <Sidebar activePage="Diretoria" />
        <AuthModal onLogin={handleLogin} error={loginError} />
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
              listaOnibus={listaOnibus}
              listaFaculdades={listaFaculdades}
              listaMotoristas={listaMotoristas}
              onibusSelecionado={onibusSelecionado}
              toggleOnibus={toggleOnibus}
              faculdadesSelecionadas={faculdadesSelecionadas}
              selecionarFaculdade={selecionarFaculdade}
              motoristasSelecionados={motoristasSelecionados}
              selecionarMotorista={selecionarMotorista}
              onSalvar={handleSalvar}
            />
          </ContentModal>
        )}
      </div>
    </div>
  );
}