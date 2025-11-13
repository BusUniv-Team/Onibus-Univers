import { useState } from "react";
import "./style.css";

function Home() {
  const [form, setForm] = useState({
    nome: "",
    turno: "",
    faculdade: "",
    curso: "",
    cpf: "",
    telefone: "",
    email: "",
    periodo: 1,
  });
  const [comprovante, setComprovante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { nome, turno, faculdade, curso, cpf, telefone, email, periodo } = form;

    if (!nome || !turno || !faculdade || !curso || !cpf || !telefone || !email || !periodo || !comprovante) {
      setMessage({ type: "error", text: "Preencha todos os campos e envie o PDF!" });
      return;
    }

    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    formData.append("comprovante", comprovante);

    setLoading(true);
    try {
      // Aqui só mostra o que seria enviado — não precisa de backend
      console.log("📦 Dados que seriam enviados:", Object.fromEntries(formData.entries()));
      setMessage({ type: "success", text: "Cadastro pronto para envio (simulação sem backend)." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h1 className="title">Cadastro Universitário</h1>
        <p className="subtitle">Digite suas informações abaixo</p>

        <label className="field">
          <span className="label-text">Nome completo</span>
          <input
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Turno</span>
          <select
            name="turno"
            value={form.turno}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Diurno">Diurno</option>
            <option value="Noturno">Noturno</option> {/* alterado de "Integral" */}
          </select>
        </label>

        <label className="field">
          <span className="label-text">Faculdade</span>
          <select
            name="faculdade"
            value={form.faculdade}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="UESC">UESC</option>
            <option value="Anhanguera">Anhanguera</option>
            <option value="UNEX">UNEX</option>
          </select>
        </label>

        <label className="field">
          <span className="label-text">Curso</span>
          <input
            name="curso"
            type="text"
            value={form.curso}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">CPF</span>
          <input
            name="cpf"
            type="text"
            maxLength="11"
            value={form.cpf}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field file-field">
          <span className="label-text">Comprovante (PDF)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setComprovante(e.target.files?.[0] ?? null)}
            required
          />
          <span className="file-hint">Envie um arquivo PDF</span>
        </label>

        <label className="field">
          <span className="label-text">Telefone</span>
          <input
            name="telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Período (1 a 12)</span>
          <input
            name="periodo"
            type="number"
            min="1"
            max="12"
            value={form.periodo}
            onChange={handleChange}
            required
          />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>

        {message && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

export default Home;
