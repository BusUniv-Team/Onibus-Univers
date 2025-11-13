import { DataTypes } from 'sequelize';
import sequelize from '../models/db.js'; // ajuste conforme seu setup

const Usuario = sequelize.define('Usuario', {
  Nome: { type: DataTypes.STRING },
  Email: { type: DataTypes.STRING, unique: true },
  CPF: { type: DataTypes.STRING, unique: true },
  // ... outros campos
});

export default Usuario;