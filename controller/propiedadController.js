import { unlink } from 'node:fs/promises'
import { Precio, Categoria, Propiedad } from '../models/index.js'
import { validationResult } from 'express-validator'

const admin = async (req, res) => {

  // Leer queryString

  const { pagina: paginaActual } = req.query

  const expresion = /^[1-9]$/

  if (!expresion.test(paginaActual)) {
    return res.redirect('/mis-propiedades?pagina=1')
  }

  try {
    const { id } = req.usuario

    // Limites y offset para el paginador
    const limit = 5
    const offset = ((paginaActual * limit)  -limit )

    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: {
          usuarioId: id
        },
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Precio, as: 'precio' }
        ],
      }),
      Propiedad.count({
        where:{
          usuarioId: id
        }
      })
    ])



    res.render('propiedades/admin', {
      pagina: 'Mis Propiedades',
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit
    })


  } catch (error) {
    console.log(error)
  }


}

// Formulario para crear propiedad
const crear = async (req, res) => {
  // Consultar modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/crear', {
    pagina: 'Crear Propiedad',
    csrfToken: req.csrfToken(),
    categorias,
    datos: {},
    precios
  })
}

const guardar = async (req, res) => {

  //Validacion
  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Consultar modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])

    return res.render('propiedades/crear', {
      pagina: 'Crear Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    })
  }

  // Crear Registro

  const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: PrecioId, categoria: CategoriaId } = req.body;

  const { id: usuarioId } = req.usuario

  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      PrecioId,
      CategoriaId,
      usuarioId,
      imagen: ''
    })

    const { id } = propiedadGuardada

    res.redirect(`/propiedades/agregar-imagen/${id}`)

  } catch (error) {
    console.log(error)
  }

}

const agregarImagen = async (req, res) => {

  const { id } = req.params

  // Validar que la propidead exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no este publicada

  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad visita esta pagina 
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }


  res.render('propiedades/agregar-imagen', {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad
  })
}

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no este publicada

  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad visita esta pagina 
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  try {
    console.log(req.file)
    // Almacenar la imagen y publicar propiedad
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;

    await propiedad.save();

    next();

  } catch (error) {
    console.log(error)
  }
}

const editar = async (req, res) => {

  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Revisar quien visita la URL es el dueño de la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  // Consultar modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/editar', {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    datos: propiedad,
    precios
  })
}

const guardarCambios = async (req, res) => {

  // Verificar la validacion
  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Consultar modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])

    res.render('propiedades/editar', {
      pagina: 'Editar Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body


    })
  }

  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Revisar quien visita la URL es el dueño de la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  // Reescribir el objeto y actualizar

  try {

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: PrecioId, categoria: CategoriaId } = req.body;

    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      PrecioId,
      CategoriaId
    })

    await propiedad.save();

    res.redirect('/mis-propiedades')

  } catch (error) {
    console.log(error)
  }

}

const eliminar = async (req, res) => {

  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Revisar quien visita la URL es el dueño de la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }


  //Eliminar la imagen
  await unlink(`public/uploads/${propiedad.imagen}`)


  // Eliminar Propiedad
  await propiedad.destroy();
  res.redirect('/mis-propiedades')



}


// Muestra una propiedad

const mostrarPropiedad = async (req, res) => {

  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Precio, as: 'precio' }
    ]
  })


  if (!propiedad) {
    return res.redirect('/404')
  }


  res.render('propiedades/mostrar', {
    propiedad,
    pagina: propiedad.titulo,
  })
}

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad
}

