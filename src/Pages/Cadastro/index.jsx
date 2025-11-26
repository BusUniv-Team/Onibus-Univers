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

    // 1. Validação simples
    if (!nome || !turno || !faculdade || !curso || !cpf || !telefone || !email || !periodo || !comprovante) {
      setMessage({ type: "error", text: "Preencha todos os campos e envie o PDF!" });
      return;
    }

    // 2. Validação do período
    const periodoNum = Number(periodo);
    if (isNaN(periodoNum) || periodoNum < 1 || periodoNum > 12) {
      setMessage({ type: "error", text: "Período deve ser um número de 1 a 12" });
      return;
    }

    setLoading(true);

    try {
      // 3. Montagem dos dados para envio
      const formData = new FormData(e.target);

      // --- TRUQUE: Injeta o CPF como senha ---
      formData.append("senha", form.cpf);

      // --- Garante que o arquivo vai junto ---
      if (comprovante) {
        formData.append("comprovante", comprovante);
      }

      // Log para conferência no navegador
      console.log("📦 Enviando:", Object.fromEntries(formData.entries()));

      // 4. ENVIO PARA O BACK-END (Mude a URL abaixo)
      const response = await fetch("http://localhost:3000/api/cadastro", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Cadastro realizado com sucesso!" });
        // Opcional: Limpar formulário após sucesso
        // setForm({ ...form, nome: "", cpf: "", ... }); 
      } else {
        setMessage({ type: "error", text: "Erro ao cadastrar. Verifique os dados." });
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      setMessage({ type: "error", text: "Erro de conexão com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <form className="cadastro-card" onSubmit={handleSubmit}>
          
          {/* Nome */}
          <input
            name="nome"
            type="text"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            required
            className="cadastro-span-2"
          />

          {/* Turno */}
          <select name="turno" value={form.turno} onChange={handleChange} required>
            <option value="">Turno</option>
            <option value="Diurno">Diurno</option>
            <option value="Integral">Noturno</option>
          </select>

          {/* Faculdade */}
          <select name="faculdade" value={form.faculdade} onChange={handleChange} required>
            <option value="">Faculdade</option>
            <option value="UESC">UESC</option>
            <option value="Anhanguera">Anhanguera</option>
            <option value="UNEX">UNEX</option>
          </select>

          {/* Curso */}
          <input
            name="curso"
            type="text"
            placeholder="Curso"
            value={form.curso}
            onChange={handleChange}
            required
            className="cadastro-span-2"
          />

          {/* CPF */}
          <input
            name="cpf"
            type="text"
            placeholder="CPF"
            maxLength="11"
            value={form.cpf}
            onChange={handleChange}
            required
          />

          {/* Telefone */}
          <input
            name="telefone"
            type="tel"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="cadastro-span-2"
          />

          {/* Período */}
          <input
            name="periodo"
            type="text"
            placeholder="Período (1-12)"
            value={form.periodo}
            onChange={handleChange}
            required
          />

          {/* Arquivo (Comprovante) */}
          <label className="cadastro-file-wrapper">
            <span className="cadastro-file-name">
              {comprovante ? comprovante.name : "Comprovante (PDF)"}
            </span>

            <span className="cadastro-file-btn">Anexar</span>

            <input
              type="file"
              className="cadastro-file-input"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
          </label>

          {/* Botão de Enviar */}
          <button className="cadastro-btn" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar"}
          </button>

          {/* Mensagem de Erro/Sucesso */}
          {message && (
            <p className={`cadastro-message ${message.type}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Cadastro;