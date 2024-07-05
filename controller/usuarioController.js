import express from 'express';
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
import { generarJWT, generaId } from '../helpers/token.js'
import { emailRegistro } from '../helpers/emails.js';
import { emailOlvidePassword } from '../helpers/emails.js';



const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
}

const autenticar = async (req, res)=>{
    // Validación...
    await check('email').isEmail().withMessage('El formato no corresponde a un email').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    } 
    
    const {email, password} = req.body;
    
    // Comprobar si el usuario existe...
    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'El usuario no existe'}]
        })
    }

    // Comprobar si el suario esta confirmado...
    if(!usuario.confirmados){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'Tu cuenta no esta confirmada'}]
        })
    }

    // Revisar password...
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'La contraseña es incorrecta'}]
        })
    }

    //Autenticar un usuario...
    
    const token = generarJWT({id: usuario.id,nombre:usuario.nombre})
    console.log(token)

    // Almacenar en un cookie...
    

    return res.cookie('_token', token,{
        httpOnly: true,
        secure: true,
        sameSite: true
    }).redirect('/')

}

const cerrarSesion = (req,res)=>{
    return res.clearCookie('_token').status(200).redirect('/auth/login')

}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const registrar = async (req, res) => {
    // Validacion...
    await check('nombre').notEmpty().withMessage('El campo nombre es obligatorio').run(req);

    await check('email').isEmail().withMessage('El formato no corresponde a un email').run(req);

    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener un minimo de 8 caracteres').run(req);

    await check('repetir_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    }).run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extrer los datos...
    const { nombre, email, password } = req.body

    // Verificar que el usuario no este duplicado...
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }



    // Almacenar un usuario...
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generaId()

    })

  


    // Envia mail confirmacion...
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })



    // Mostrar mensaje de confirmacion...
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona el enlace para continuar'
    })

}

// Funcion que comprueba una cuenta...
const confirmar = async (req, res) => {
    const { token } = req.params

    //Verificar si el token es valido...
    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, porfavor intenta de nuevo',
            error: true
        })
    }

    // Confirmar cuenta...
    usuario.token = null;
    usuario.confirmados = true;
    await usuario.save();
    

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
        error: false
    })



}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a bienes raices',
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async (req, res) => {
    // Validacion...
    await check('email').isEmail().withMessage('El formato no corresponde a un email').run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a bienes raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Buscar al usuario...

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a bienes raices',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El Email no pertenece a ningun usuario' }]
        })
    }

    // Generar token y enviar mail...
    usuario.token = generaId();
    await usuario.save();

    // Enviar un email...
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Renderizar un mensaje...
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu contraseña',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {

    const { token } = req.params

    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu contraseña ',
            mensaje: 'Hubo un error al validar tus datos, porfavor intenta de nuevo',
            error: true
        })
    }

    // Mostar formulario para modificar el password...
    res.render('auth/reset-password', {
        pagina: 'Restablece tu contraseña',
        csrfToken: req.csrfToken()
    })


}

const nuevoPassword = async (req, res) => {
    // Validar el password...
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener un minimo de 8 caracteres').run(req);

    await check('repetir_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    }).run(req);
    
    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const {token} = req.params;
    const {password} = req.body;
    
    // Idetificar quien hace el cambio...
    const usuario = await Usuario.findOne({where: {token}})
 
    // Hashear el nuevo password...
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Contraseña Restablecida Correctamente',
        mensaje: 'La contraseña se cambio correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}
