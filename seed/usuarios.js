import bcrypt from 'bcrypt'

const usuarios = [{
    nombre: 'Facundo',
    email: 'facu@facu.com',
    confirmados: 1,
    password: bcrypt.hashSync('password', 10)

}]

export default usuarios