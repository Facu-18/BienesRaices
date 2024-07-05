import express from 'express'
import { mostrarPerfil } from '../controller/perfilController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import identificarUsuario from "../middleware/identificarUsuario.js"

const router = express.Router();

router.get('/mi-perfil', protegerRuta, identificarUsuario, mostrarPerfil)

export default router;