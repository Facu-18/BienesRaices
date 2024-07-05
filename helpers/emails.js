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
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p style="font-size: 16px;">Hola ${nombre},</p>
                <p style="font-size: 16px;">Confirma tu cuenta en BienesRaices.com</p>
                <p style="font-size: 16px;">Tu cuenta está casi lista, solo debes confirmar haciendo clic en el siguiente enlace:</p>
                <p><a href="${process.env.BACKEND_URL}:${process.env.PORT || 8080}/auth/confirmar/${token}" style="background-color: #4a90e2; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirmar Cuenta</a></p>
                <p style="font-size: 16px;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
            </div>
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
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p style="font-size: 16px;">Hola ${nombre},</p>
                <p style="font-size: 16px;">Has solicitado reestablecer tu contraseña en BienesRaices.com</p>
                <p style="font-size: 16px;">Sigue el siguiente enlace para generar una nueva contraseña:</p>
                <p><a href="${process.env.BACKEND_URL}:${process.env.PORT || 8080}/auth/olvide-password/${token}" style="background-color: #4a90e2; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reestablecer Contraseña</a></p>
                <p style="font-size: 16px;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            </div>
        `
    })

}

const emailMensaje = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, propiedadId } = datos;

    // Enviar el mail
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Recibiste un mensaje sobre tu publicación en BienesRaices.com',
        text: 'Recibiste un mensaje sobre tu publicación en BienesRaices.com',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p style="font-size: 16px;">Hola ${nombre},</p>
                <p style="font-size: 16px;">Recibiste un mensaje sobre tu publicación en BienesRaices.com</p>
                <p style="font-size: 16px;">Haz clic en el siguiente enlace para ver más información:</p>
                <p><a href="${process.env.FRONTEND_URL}/mensaje/${propiedadId}" style="background-color: #4a90e2; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Más Info</a></p>
            </div>
        `
    });
}


export {
    emailRegistro,
    emailOlvidePassword,
    emailMensaje
}