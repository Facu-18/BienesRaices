import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Categoria = db.define('Propiedades',{
   nombre:{
      type: DataTypes.STRING(30),
      allowNull: false
   }
});


export default Categoria