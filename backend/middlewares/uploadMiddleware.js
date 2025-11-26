const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf
    const nomeBase = path.basename(file.originalname, ext);
    const nomeUnico = `${nomeBase}-${Date.now()}${ext}`;
    cb(null, nomeUnico);
  },
});

// aceitar so PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos PDF são permitidos."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


module.exports = upload;
