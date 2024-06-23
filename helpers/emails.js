import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos

    // Enviar el mail
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text:'Confirma tu cuenta en BienesRaices.com',
        html: `
             <p>Hola ${nombre}, confirma tu cuenta en BienesRaices.com</p>

             <p>Tu cuenta ya esta casi lista, solo debes confirmar dando click al siguiente enlace:
             <a href="${process.env.BACKEND_URL}:${process.env.PORT || 8080}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>

             <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })

}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos

    // Enviar el mail
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu contraseña en BienesRaices.com',
        text:'Reestablece tu contraseña en BienesRaices.com',
        html: `
             <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en BienesRaices.com</p>

             <p>Sigue el siguiente enlace para generar una nueva contaseña:
             <a href="${process.env.BACKEND_URL}:${process.env.PORT || 8080}/auth/olvide-password/${token}">Reestablecer Contraseña</a> </p>

             <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
        `
    })

}




export {
    emailRegistro,
    emailOlvidePassword
}