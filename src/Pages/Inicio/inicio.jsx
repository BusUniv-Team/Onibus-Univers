import { useState, useEffect } from "react";
import "./inicio.css";

import Sidebar from "../../components/SideBar/Sidebar";

// --- IMAGENS DE FUNDO DOS CARDS ---
import imgFundoEsquerda from "../../assets/card3.png"; 
import imgFundoMeio from "../../assets/card2.png";     
import imgFundoDireita from "../../assets/card1.png";

// --- NOVAS IMAGENS (ÔNIBUS PEQUENOS) ---
import iconBusVerde from "../../assets/onibus_verde.png";   
import iconBusAmarelo from "../../assets/onibus_amarelo.png"; 
import iconBusPadrao from "../../assets/onibus_amareloG.png";   

// URL base que conecta no backend
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

  // ESTADO ATUALIZADO: Agora inclui 'grupo' e 'nome_exibicao'
  const [stats, setStats] = useState({
    anhanguera: { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null },
    unex:       { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null },
    uesc:       { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Chama a rota criada no backend: /api/dashboard/contagem/current-votes?dia=SEG
        const response = await jsonFetch(`${API_BASE_URL}/current-votes?dia=${diaAtual}`);
        if (response) {
            // O backend retorna agora nome_exibicao e grupo
            setStats(response);
        }
      } catch (error) {
        console.error("Erro ao atualizar dashboard:", error);
      }
    };

    fetchStats(); 
    // Atualiza a cada 5 segundos para pegar votos novos em tempo real
    const interval = setInterval(fetchStats, 5000); 

    return () => clearInterval(interval);
  }, [diaAtual]);

  // --- FUNÇÃO PARA ESCOLHER A IMAGEM PEQUENA ---
  const getIconeOnibus = (grupo) => {
    // Se grupo for null ou undefined, retorna padrão
    if (!grupo) return iconBusPadrao; 
    
    // Transforma em minúsculas e remove espaços extras
    const grupoLower = grupo.toLowerCase().trim();
    
    // 1. Lógica para os Verdes (Verde 01, Verde 02, etc)
    if (grupoLower.includes("verde")) {
        return iconBusVerde;
    } 
    
    // 2. Lógica para o Amarelinho PEQUENO (Se o grupo for só "Amarelo" ou "Amarelinho")
    // Cuidado para não confundir com "Amarelo G"
    if (grupoLower === "amarelo" || grupoLower === "amarelinho") {
        return iconBusAmarelo; 
    } 
    
    // 3. Todo o resto vai ser o ônibus Grande (Gran, Amarelo G, Padrao)
    return iconBusPadrao;
  };

  // Mapeamento dos dados para gerar os cards
  const cardsData = [
    { id: "esq", imgBg: imgFundoEsquerda, dados: stats.anhanguera },
    { id: "meio", imgBg: imgFundoMeio, dados: stats.unex },
    { id: "dir", imgBg: imgFundoDireita, dados: stats.uesc }
  ];

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