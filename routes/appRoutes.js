import express from 'express'
import {inicio, categoria, notFound, buscador} from '../controller/appController.js'

const router = express.Router()

// Pagina de inicio
router.get('/', inicio)

// Categorias
router.get('/categorias/:id', categoria)

// Pagina 404
router.get('/404', notFound)

// Buscador
router.post('/buscador', buscador)


export default router;