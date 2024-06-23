import jwt from 'jsonwebtoken'

const generarJWT = datos => {
    return jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '2d' });
};

const generaId = () => Math.random().toString(32).substring(2) + Date.now().toString(32)

export{
    generarJWT,
    generaId
}