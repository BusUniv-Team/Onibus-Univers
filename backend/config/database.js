import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

app.get('/usuarios', async (req, res) =>{
  try {
      const [rows] = await pool.query (
        'SELECT * FROM usuario'
      );
      res.json(rows);

  } catch (error) {
    res.status(500).json({
      error: 'database error'
    })
    
  }
})

app.listen(3001, () => {
  console.log("API rodando na porta 3001")
})
