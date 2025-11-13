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
    periodo: "",
  });

  const [comprovante, setComprovante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setComprovante(e.target.files?.[0] ?? null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    const { nome, turno, faculdade, curso, cpf, telefone, email, periodo } = form;

    if (!nome || !turno || !faculdade || !curso || !cpf || !telefone || !email || !periodo || !comprovante) {
      setMessage({ type: "error", text: "Preencha todos os campos e envie o PDF!" });
      return;
    }

    const periodoNum = Number(periodo);
    if (isNaN(periodoNum) || periodoNum < 1 || periodoNum > 12) {
      setMessage({ type: "error", text: "Período deve ser um número de 1 a 12" });
      return;
    }

    console.log("📦 Dados do formulário:", Object.fromEntries(new FormData(e.target).entries()));
    setMessage({ type: "success", text: "Cadastro pronto para envio (simulação)." });
  };

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(/fundo2.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <form className="card" onSubmit={handleSubmit}>
        <input
          name="nome"
          type="text"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          required
          className="span-2"
        />
        <select name="turno" value={form.turno} onChange={handleChange} required>
          <option value="">Turno</option>
          <option value="Diurno">Diurno</option>
          <option value="Integral">Integral</option>
        </select>
        <select name="faculdade" value={form.faculdade} onChange={handleChange} required>
          <option value="">Faculdade</option>
          <option value="UESC">UESC</option>
          <option value="Anhanguera">Anhanguera</option>
          <option value="UNEX">UNEX</option>
        </select>
        <input
          name="curso"
          type="text"
          placeholder="Curso"
          value={form.curso}
          onChange={handleChange}
          required
          className="span-2"
        />
        <input
          name="cpf"
          type="text"
          placeholder="CPF"
          maxLength="11"
          value={form.cpf}
          onChange={handleChange}
          required
        />
        <input
          name="telefone"
          type="tel"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="span-2"
        />
        <input
          name="periodo"
          type="text"
          placeholder="Período (1-12)"
          value={form.periodo}
          onChange={handleChange}
          required
        />

        <label className="file-wrapper">
          <span className="file-name">
            {comprovante ? comprovante.name : "Comprovante (PDF)"}
          </span>
          <span className="file-btn">Anexar</span>
          <input
            type="file"
            className="file-input"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>

        {message && <p className={`message ${message.type}`}>{message.text}</p>}
      </form>
    </div>
  );
}

export default Home;
