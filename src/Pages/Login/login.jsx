import React from "react";
import fundo from "../../assets/fundo.jpg"; // imagem de fundo

<<<<<<< HEAD
function Login() {
    return (
        <div>
            <p>Alguma coisa</p>
        </div>
    );
    }
=======
export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você futuramente envia os dados pro backend
    console.log("Login enviado!");
  };

  return (
    <div
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
      <div className="card shadow-lg p-4" style={{ width: "350px", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Ônibus Faculdade</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuário</label>
            <input
              type="text"
              id="usuario"
              className="form-control"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              id="senha"
              className="form-control"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}
>>>>>>> 42c2e5300df4a55493e476985de0ff25e00020e1
