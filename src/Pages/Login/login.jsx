import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fundo from "../../assets/fundo.jpg";
import "./login.css";

export default function Login() {
  const [usuario, setUsuario] = useState(""); // aqui o "usuario" será o CPF
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!usuario || !senha) {
      setError("Preencha CPF e senha.");
      return;
    }

    setLoading(true);
    try {
      // ponto importante: backend que usamos no exemplo é em 3001 e rota /auth/login
      // se o seu backend estiver em outra porta/rota, ajuste aqui
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // enviamos CPF como "cpf" — o backend espera { cpf, senha }
        body: JSON.stringify({ cpf: usuario, senha }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.mensagem || data.error || "CPF ou senha inválidos.");
        setLoading(false);
        return;
      }

      // salvar token e info do usuário
      if (data.token) localStorage.setItem("token", data.token);
      if (data.usuario) localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // redirecionar para /inicio
      navigate("/inicio");
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="container-login"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form className="form-login" onSubmit={handleSubmit}>
        <h1 className="titulo-login">Ônibus Faculdade:</h1>

        <label className="label-usuario" htmlFor="usuario">Usuário:</label><br />
        <input
          className="input-usuario"
          id="usuario"
          type="text"
          placeholder="Digite seu usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        /><br /><br />

        <label className="label-senha" htmlFor="senha">Senha:</label><br />
        <input
          className="input-senha"
          id="senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br /><br />

        <button className="botao-login" type="submit">Entrar</button>
      </form>
    </div>
  );
}