import express from 'express';
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad, enviarMensaje, verMensajes, cambiarEstado } from '../controller/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from "../middleware/identificarUsuario.js"

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear',
    protegerRuta,
    // Validaciones
    body('titulo').notEmpty().withMessage('El Titulo Es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripción Es Obligatoria').isLength({ max: 200 }).withMessage('La Descripcion No puede superar los 200 caracteres'),
    body('categoria').isNumeric().withMessage('Selecciona Una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona Un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona El numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona El numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona el numero de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar)

router.get('/propiedades/agregar-imagen/:id',
    protegerRuta,
    agregarImagen,
)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id',
    protegerRuta,
    // Validaciones
    body('titulo').notEmpty().withMessage('El Titulo Es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripción Es Obligatoria').isLength({ max: 200 }).withMessage('La Descripcion No puede superar los 200 caracteres'),
    body('categoria').isNumeric().withMessage('Selecciona Una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona Un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona El numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona El numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona el numero de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

// Área Pública
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)

// Almacenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({ min: 15 }).withMessage('El mensaje no puede ir vacío o es muy corto'),
    enviarMensaje
)

router.get('/mensaje/:id',
    protegerRuta,
    identificarUsuario,
    verMensajes
)

export default router;
