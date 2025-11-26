import { useState, useEffect } from "react";
import "./profile.css";
import Sidebar from "../../components/SideBar/Sidebar";
import defaultPhoto from "../../assets/profile_picture.png";



export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);

  // ESTADO DO USUÁRIO – valores temporários até o backend responder
  const [user, setUser] = useState({
    name: "Carregando...",
    login: "carregando...",
    email: "carregando...",
    password: "********",
    score: 6,
    photo: defaultPhoto,
  });

  // ============================
  // 🔄 Carregar dados do backend
  // ============================
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          credentials: "include",
        });

        const data = await response.json();

        setUser({
          name: data.name,
          login: data.login,
          email: data.email,
          password: "********", // nunca exiba a senha real!
          score: data.score ?? 0,
          photo: data.photoUrl ?? defaultPhoto,
        });
      } catch {
        console.log("Backend offline. Usando dados mockados.");
      }
    }

    loadUser();
  }, []);

  // ============================
  // 📸 Alterar foto (preview local)
  // ============================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const preview = URL.createObjectURL(file);

      setUser((u) => ({
        ...u,
        photo: preview,   // mostra a foto escolhida
        photoFile: file,  // guarda o arquivo para enviar depois
        }));


      // TODO: Enviar foto para o backend aqui:
      // const formData = new FormData();
      // formData.append("file", file);
      // fetch(...);
    }
  };

  return (
    <div className="profile-wrapper">
      <Sidebar activePage="Perfil" />

      <main className="main-container">
        {/* FOTO DO USUÁRIO */}
        <div className="profile-photo-section">
          <div className="profile-photo">
            <img src={user.photo} alt="Foto de Perfil" />
          </div>

          <label className="profile-change">
            Alterar foto
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden-input"
            />
          </label>
        </div>

        {/* NOME */}
        <h1 className="profile-name">{user.name}</h1>

        {/* GRID */}
        <div className="profile-grid">
          {/* CARD: informações */}
          <div className="cardz">
            <h2>Informações</h2>
            <div className="info-list">
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Login:</strong> {user.login}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p className="password-row">
                <strong>Senha:</strong>
                <span className="password-display">
                  {showPassword ? "********" : "********"}
                  <button
                  className="show-pass-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  ></button>
                 </span></p>

            </div>
          </div>

          {/* CARD: Score */}
          <div className="cardz">
            <h2>Score</h2>

            <div className="energy-wrapper">
              <div className="energy-bar">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`energy-cell ${
                      i < user.score ? "" : "off"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
