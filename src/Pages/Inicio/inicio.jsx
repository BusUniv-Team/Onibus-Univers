import { useState, useEffect } from "react";
import "./inicio.css";

import Sidebar from "../../components/SideBar/Sidebar";


import imgFundoEsquerda from "../../assets/card3.png"; 
import imgFundoMeio from "../../assets/card2.png";     
import imgFundoDireita from "../../assets/card1.png";


import iconBusVerde from "../../assets/onibus_verde.png";   
import iconBusAmarelo from "../../assets/onibus_amarelo.png"; 
import iconBusPadrao from "../../assets/onibus_amarelo.png";  


const API_BASE_URL = 'http://localhost:3001/api/dashboard/contagem';

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
    anhanguera: { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null },
    unex:       { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null },
    uesc:       { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null },
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

  
  const getIconeOnibus = (grupo) => {
    
    if (!grupo) return iconBusPadrao; 
    
    
    const grupoLower = grupo.toLowerCase().trim();
    
    
    if (grupoLower.includes("verde")) {
        return iconBusVerde;
    } 
    
    
    
    if (grupoLower === "amarelo" || grupoLower === "amarelinho") {
        return iconBusAmarelo; 
    } 
    
    
    return iconBusPadrao;
  };

  
  const cardsData = [
    { id: "esq", imgBg: imgFundoEsquerda, dados: stats.anhanguera },
    { id: "meio", imgBg: imgFundoMeio, dados: stats.unex },
    { id: "dir", imgBg: imgFundoDireita, dados: stats.uesc }
  ];

  return (
    <div className="app-inicio-wrapper">
      <Sidebar activePage="inicio" />

      <div className="app-content-wrapper">
        <div className="inicio-container">
          
          <div className="cards-wrapper">
            {cardsData.map((card) => (
              <div key={card.id} className="bus-card">
                
                {/* 1. Fundo do Card */}
                <img src={card.imgBg} alt="Fundo Card" className="card-img-full" />

                {/* 2. Imagem do Ônibus Variável (Usa o campo 'grupo' para a cor) */}
                <img 
                  src={getIconeOnibus(card.dados.grupo)} 
                  alt="Ícone Ônibus" 
                  className="bus-icon-overlay" 
                />
                
                {/* 3. Nome do Motorista ou Status (Usa o campo 'nome_exibicao') */}
                <div className="driver-name">
                  {card.dados.nome_exibicao}
                </div>

                {/* 4. Contadores (Zeros ou números do banco) */}
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