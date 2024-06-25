import { exit } from 'node:process'
import categorias from "./categorias.js";
import precios from './precios.js';
import Categoria from "../models/Categoria.js"
import db from "../config/db.js"
import Precio from '../models/Precio.js';

const importarDatos = async () => {
    try{
        // Autenticar en la db
        await db.authenticate()

        // Generar las columnas
        await db.sync()
        
        // Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])
        
        console.log('Datos Imporatados Correctamente')
        exit()

    }
    catch(error){
        console.log(error)
        exit(1)
    }

}
if(process.argv[2] === "-i"){
    importarDatos();
}

