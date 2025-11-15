import React, { useState } from "react";
import fundo from "../../assets/fundo.jpg";
import "./login.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      if (response.ok) {
        alert("Login realizado com sucesso!");
      } else {
        alert("Usuário ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao tentar fazer login. Tente novamente.");
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