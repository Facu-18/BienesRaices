import Categoria from "./Categoria.js";
import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js"


Propiedad.belongsTo(Precio, { foreignKey: 'PrecioId', as: 'precio'})
Propiedad.belongsTo(Categoria, {foreignKey: 'CategoriaId', as: 'categoria'} )
Propiedad.belongsTo(Usuario)


export{
    Propiedad,
    Precio,
    Categoria,
    Usuario
}