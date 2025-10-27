# 🚌 BusUniv — Sistema de Gerenciamento do Ônibus Universitário

## 📘 Visão Geral

O **BusUniv** é um sistema web desenvolvido para **organizar e gerenciar o transporte universitário**, permitindo que alunos confirmem presença nos trajetos e que a diretoria tenha controle sobre a **lotação dos ônibus** e **gestão dos assentos**.

O principal objetivo é **otimizar o uso dos veículos**, garantindo transparência, organização e facilidade tanto para os alunos quanto para os administradores do transporte.

---

## 🎯 Objetivos do Projeto

- Automatizar a **confirmação diária de presença** dos alunos.  

- Calcular automaticamente **quantos ônibus são necessários** por dia.  

- **Alocar assentos** de forma inteligente conforme as confirmações.  

- Permitir que a **diretoria visualize relatórios e estatísticas**.  

- Facilitar a **comunicação entre alunos, secretários e administração**.  

- Reduzir erros e atrasos através de um sistema online simples e intuitivo.

---

## ⚙️ Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
|---------|-------------|-----------|
| **Front-end** | React.js | Criação da interface interativa e responsiva |
| **Estilos** | Bootstrap 5 | Framework CSS utilizado para layout e componentes |
| **Back-end** | Node.js + Express | Estrutura principal da API REST |
| **Autenticação** | JWT (JSON Web Token) | Controle de login e autorização segura |
| **Banco de Dados** | MySQL | Armazenamento relacional de usuários, viagens e presenças |
| **Upload de Arquivos** | Multer | Upload e gerenciamento de PDFs de comprovante |
| **Controle de Versão** | Git + GitHub | Colaboração e versionamento do código |
| **Outras Ferramentas** | Nodemon, Axios | Agilidade no desenvolvimento e integração front-back |

---

## 🧩 Estrutura Inicial do Projeto

```
ONIBUS/
├── backend/
│ ├── .env
│ ├── config/
│ │ └── database.js
│ ├── controllers/
│ │ ├── authControllers.js
│ │ ├── cadastroController.js
│ │ └── userControllers.js
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ ├── roleMiddleware.js
│ │ └── uploadMiddleware.js
│ ├── models/
│ │ ├── db.js
│ │ └── usuario.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ └── userRoutes.js
│ ├── uploads/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── assets/
│ │ ├── Pages/
│ │ │ ├── Home/
│ │ │         ├── index.jsx
│ │ │         └── style.css
│ │ ├── main.jsx
│ │ ├── index.css
│ │ └── App.jsx
│ ├── package.json
│ ├── vite.config.js
│ ├── eslint.config.js
│ ├── .gitignore
│ └── README.md
│
├── package-lock.json
├── package.json
└── README.md
```

---

## 🧠 Funcionalidades Planejadas

- [ ] Cadastro e login com CPF e senha (JWT)  
- [ ] Upload de comprovante em PDF (Multer)  
- [ ] Página do aluno com status de presença  
- [ ] Painel administrativo (diretoria e secretários)  
- [ ] Cálculo automático de assentos disponíveis  
- [ ] Geração de relatórios e lista de passageiros  
- [ ] Sistema de notificações internas  
- [ ] Integração completa via REST API  

---

## 🚀 Como Rodar o Projeto Localmente

### 🔧 Pré-requisitos
- Node.js instalado  
- MySQL configurado  
- Git instalado  

### 🧭 Passos
```bash
# Clonar o repositório
git clone https://github.com/FenixLzk/Onibus-Univers

# Entrar na pasta principal
cd Onibus-Univers
```

### ▶️ Rodando o Backend
```bash
cd backend
npm install
npm start
```

### 💻 Rodando o Frontend
```bash
cd src
npm install
npm start
```

O projeto será executado em:
- **Frontend:** http://localhost:3000  
- **Backend:** http://localhost:5000

---

## 👥 Equipe do Projeto

| Nome | Função | Instagram | GitHub |
|------|---------|--------|
| **Jailton Pinheiro** | Developer Full Stack / Líder Técnico | [@j.piinheiro] | (https://github.com/FenixLzk) |

| **Marcel Kaliq** | Database Developer / Front-End Support | [@marcel_kaliq] | (https://github.com/Snowlyzin) |

| **Rodrigo Chagas** | Front-End Developer / UX & MySQL Support | [@rodrigochagasofficial]| (https://github.com/RChagaz) |

---


## 🧾 Licença
Este projeto é proprietário.  
Você pode estudá-lo e se inspirar, mas **não pode copiar, modificar ou redistribuir** sem permissão.  
© 2025 - Jailton Pinheiro. Todos os direitos reservados.

