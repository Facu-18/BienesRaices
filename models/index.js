import Categoria from "./Categoria.js";
import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js"
import Mensaje from "./Mensaje.js"


Propiedad.belongsTo(Precio, { foreignKey: 'PrecioId', as: 'precio'})
Propiedad.belongsTo(Categoria, {foreignKey: 'CategoriaId', as: 'categoria'} )
Propiedad.belongsTo(Usuario)
Propiedad.hasMany(Mensaje, {foreignKey: 'propiedadId'})

Mensaje.belongsTo(Propiedad, {foreignKey: 'propiedadId'})
Mensaje.belongsTo(Usuario, {foreignKey: 'usuarioId'})

export{
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}