import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import perfilRoutes from './routes/perfilRoutes.js';
import db from './config/db.js'
import identificarUsuario from './middleware/identificarUsuario.js';

// Crear la app...
const app = express();

// Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) )

// Habilitar cookie parser...
app.use( cookieParser() )
app.use(identificarUsuario);

// Habilitar expressjson
app.use(express.json());

// Habilitar csrf
app.use( csrf({cookie: true}) )

// Conexion a la db
try{
    await db.authenticate();
    db.sync();
    console.log('Conecxion Correcta a la base de datos')
}
catch (error){
    console.log(error);
}

// Habilitar pug...
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta Pública...
app.use(express.static('public'));

// Routing...
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadRoutes)
app.use('/api', apiRoutes)
app.use('/perfil', perfilRoutes)

// Definir un puerto...
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en el puerto: ${port}`);
});
