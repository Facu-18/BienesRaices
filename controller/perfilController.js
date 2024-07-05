import { Usuario, Propiedad } from "../models/index.js";

const mostrarPerfil = async (req, res) => {
    try {
        // Obtener el usuario actual
        const { id } = req.usuario;
        const usuario = await Usuario.findByPk(id);

        // Obtener el número de propiedades del usuario
        const propiedadesCount = await Propiedad.count({
            where: {
                usuarioId: id
            }
        });

        res.render('mi-perfil', {
            pagina: 'MI PERFIL',
            usuario,
            propiedadesCount
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

export {
    mostrarPerfil
};
