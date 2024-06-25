import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Precio = db.define('Precio',{
   nombre:{
      type: DataTypes.STRING(30),
      allowNull: false
   }
});


export default Precio