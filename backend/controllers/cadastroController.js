import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.js';

export const registrarUsuario = async (req, res) => {
  try {
    console.log('> registrarUsuario body:', req.body);
    console.log('> registrarUsuario file:', req.file);

    // nomes devem corresponder ao form (nome, turno, faculdade, curso, cpf, telefone, email, periodo)
    const {
      nome,
      turno,
      faculdade,
      curso,
      cpf,
      telefone,
      email,
      periodo
    } = req.body;

    // validação simples
    if (!nome || !turno || !faculdade || !curso || !cpf || !telefone || !email || !periodo) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Erro: Comprovante (PDF) é obrigatório.' });
    }

    const comprovantePath = req.file.filename;

    // criptografa CPF como senha (string)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(String(cpf), salt);

    const novoUsuario = await Usuario.create({
      Nome: nome,
      Email: email,
      CPF: cpf,
      Semestre: periodo,
      Turno: turno,
      Comprovante: comprovantePath,
      Faculdade: faculdade,
      Telefone: telefone,
      Curso: curso,
      senha: senhaCriptografada,
      Cargos: 'aluno'
    });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      usuario: novoUsuario
    });
  } catch (error) {
    console.error('Erro registrarUsuario:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Erro: CPF ou Email já cadastrado.' });
    }
    return res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
};