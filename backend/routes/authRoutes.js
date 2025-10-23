import express from 'express'
import multer from 'multer'
import path from 'path'
import { cadastrarUniversitario } from '../controllers/cadastroController.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve('uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new Error('Apenas PDFs são aceitos'))
    cb(null, true)
  }
})

router.post('/', upload.single('comprovante'), cadastrarUniversitario)

export default router

