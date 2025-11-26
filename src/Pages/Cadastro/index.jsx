import { useState } from "react";
import "./style.css";

function Cadastro() {
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

  const handleSubmit = async (e) => {
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
    setLoading(true);
    try {
      const resposta = await fetch("http://localhost:3001/api/usuarios/cadastrar", {
      method: "POST",
      body: formData, // 👈 Não coloque headers
    });

      const data = await resposta.json();
      console.log("🔁 Resposta do backend:", data);

      if (!resposta.ok) {
        setMessage({
          type: "error",
          text: data.mensagem || "Erro ao enviar cadastro para o servidor.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data.mensagem || "Cadastro enviado ao servidor com sucesso!",
      });
    } catch (erro) {
      console.error("Erro ao enviar para o backend:", erro);
      setMessage({
        type: "error",
        text: "Erro de conexão com o servidor.",
      });
    } finally {
      setLoading(false);
    }
  };



return (
  <div className="home-page">
    <div className="home-container">
      <form className="home-card" onSubmit={handleSubmit}>
        <input
          name="nome"
          type="text"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          required
          className="home-span-2"
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
          className="home-span-2"
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
          className="home-span-2"
        />

        <input
          name="periodo"
          type="text"
          placeholder="Período (1-12)"
          value={form.periodo}
          onChange={handleChange}
          required
        />

        {/* Arquivo */}
        <label className="home-file-wrapper">
          <span className="home-file-name">
            {comprovante ? comprovante.name : "Comprovante (PDF)"}
          </span>

          <span className="home-file-btn">Anexar</span>

          <input
            type="file"
            className="home-file-input"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </label>

        <button className="home-btn" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>

        {message && (
          <p className={`home-message ${message.type}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  </div>
);
}

export default Cadastro;
