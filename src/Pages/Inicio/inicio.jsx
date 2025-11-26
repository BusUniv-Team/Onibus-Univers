import { useState, useEffect } from "react";
import "./inicio.css";

import Sidebar from "../../components/SideBar/Sidebar";

// --- IMAGENS DE FUNDO DOS CARDS ---
import imgFundoEsquerda from "../../assets/card3.png"; 
import imgFundoMeio from "../../assets/card2.png";     
import imgFundoDireita from "../../assets/card1.png";

// --- NOVAS IMAGENS (ÔNIBUS PEQUENOS) ---
// Seus nomes de arquivo exatos conforme seu print
import iconBusVerde from "../../assets/onibus_verde.png";   
import iconBusAmarelo from "../../assets/onibus_amarelo.png"; 
import iconBusPadrao from "../../assets/onibus_amareloG.png";   

const API_BASE_URL = 'http://localhost:3000/api/poll';

const getDiaAtual = () => {
  const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  return dias[new Date().getDay()];
};

async function jsonFetch(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro na requisição");
  return response.json();
}

export default function Inicio() {
  const diaAtual = getDiaAtual();

  const [stats, setStats] = useState({
    anhanguera: { ida: 0, volta: 0, idaEVolta: 0, nome: "Aguardando..." },
    unex: { ida: 0, volta: 0, idaEVolta: 0, nome: "Aguardando..." },
    uesc: { ida: 0, volta: 0, idaEVolta: 0, nome: "Aguardando..." },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await jsonFetch(`${API_BASE_URL}/current-votes?dia=${diaAtual}`);
        if (response) {
            setStats(response);
        }
      } catch (error) {
        console.error("Erro ao atualizar dashboard:", error);
      }
    };

    fetchStats(); 
    const interval = setInterval(fetchStats, 5000); 

    return () => clearInterval(interval);
  }, [diaAtual]);

  // --- FUNÇÃO PARA ESCOLHER A IMAGEM PEQUENA ---
  const getIconeOnibus = (nome) => {
    if (!nome) return iconBusPadrao;
    const nomeLower = nome.toLowerCase();
    
    if (nomeLower.includes("verde")) return iconBusVerde;
    if (nomeLower.includes("amarelo") || nomeLower.includes("gran")) return iconBusAmarelo;
    
    return iconBusPadrao;
  };

  // Mapeamento dos dados
  const cardsData = [
    { id: "esq", imgBg: imgFundoEsquerda, dados: stats.anhanguera },
    { id: "meio", imgBg: imgFundoMeio, dados: stats.unex },
    { id: "dir", imgBg: imgFundoDireita, dados: stats.uesc }
  ];

  // [NOVO] Estado para o efeito de pressionar no mobile
  const [expandedCard, setExpandedCard] = useState(null);

  // [NOVO] Funções para lidar com o toque/clique
  const handlePressStart = (id) => {
    if (window.innerWidth <= 1024) { // Só ativa no mobile
      setExpandedCard(id);
    }
  };

  const handlePressEnd = () => {
    setExpandedCard(null); // Soltou, volta ao normal
  };

  return (
    <div className="app-sidebar-wrapper">
      <Sidebar activePage="inicio" />

      <div className="app-content-wrapper">
        <div className="inicio-container">
          
          <div className="cards-wrapper">
            {cardsData.map((card) => (
              <div key={card.id} className="bus-card">
                
{/* 1. Fundo do Card */}
<img src={card.imgBg} alt="Fundo Card" className="card-img-full" />

{/* 2. [NOVO] Imagem do Ônibus Variável (Sobreposta) */}
<img 
  src={getIconeOnibus(card.dados.nome)} 
  alt="Ícone Ônibus" 
  className="bus-icon-overlay" 
/>
                
                {/* 2. Imagem do Ônibus Variável (Sobreposta) */}
                <img 
                  src={getIconeOnibus(card.dados.nome)} 
                  alt="Ícone Ônibus" 
                  className="bus-icon-overlay" 
                />
                
                {/* 3. Nome do Motorista */}
                <div className="driver-name">
                  {card.dados.nome}
                </div>

                {/* 4. Zeros */}
                <div className="stats-overlay">
                   <div className="stat-number">{card.dados.ida}</div>
                   <div className="stat-number">{card.dados.idaEVolta}</div>
                   <div className="stat-number">{card.dados.volta}</div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}