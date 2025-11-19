import { useState } from "react";
import "./profile.css";
import Sidebar from "../../components/SideBar/Sidebar";



export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // TODO: salvar imagem no backend futuramente
    }
  };

  return (
    <div className="profile-wrapper">
      {/* SIDEBAR: COPIE ESSE CÓDIGO E O IMPORT*/}
      <Sidebar activePage="Perfil" />


      {/* MAIN CONTENT */}
      <main className="main-container">
        {/* FOTO DE PERFIL */}
        <div className="profile-photo-section">
          <div className="profile-photo">
            {profileImage ? <img src={profileImage} alt="Profile" /> : null}
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

        {/* NOME DO USER */}
        <h1 className="profile-name">Rodrigo Chagas dos Santos</h1>

        {/* CONTAINERS */}
        <div className="profile-grid">
          {/* CONTAINER INFO */}
          <div className="cardz">
            <h2>Informações</h2>
            <div className="info-list">
              <p>
                <strong>Nome:</strong> Rodrigo Chagas dos Santos
              </p>
              <p>
                <strong>Login:</strong> usuario123
              </p>
              <p>
                <strong>Email:</strong> teste@gmail.com
              </p>
              <p>
                <strong>Senha:</strong> ********
              </p>
            </div>
          </div>

          {/* CONTAINER SCORE */}
          <div className="cardz">
            <h2>Score</h2>
            <p>Seu score será mostrado aqui</p>
          </div>
        </div>
      </main>
    </div>
  );
}
