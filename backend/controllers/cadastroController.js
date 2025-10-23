export const cadastrarUniversitario = (req, res) => {
  try {
    // logs para diagnóstico
    console.log('--- cadastro request ---');
    console.log('body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.files:', req.files);

    const { cpf, telefone, email } = req.body;

    // aceitar várias formas (multer.single => req.file, multer.fields => req.files.comprovante)
    const comprovante =
      req.file ||
      (req.files && (req.files.comprovante ? (Array.isArray(req.files.comprovante) ? req.files.comprovante[0] : req.files.comprovante) : null)) ||
      null;

    // validação
    if (!cpf || !telefone || !email || !comprovante) {
      return res.status(400).json({ message: "Preencha todos os campos e envie o PDF!" });
    }

    console.log("Novo universitário cadastrado:", cpf, email, 'arquivo:', comprovante.filename || comprovante.originalname);

    return res.status(200).json({
      message: "Cadastro recebido com sucesso!",
      data: {
        cpf,
        telefone,
        email,
        comprovante: comprovante.filename || comprovante.originalname
      }
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
