/**
 * Alumno Controller
 * Maneja las requests HTTP para alumnos
 */

const asyncHandler = require('../../utils/asyncHandler')
const { getAll, getById, create, update, remove } = require('./alumno.service')

/**
 * GET /api/alumnos
 * Obtener todos los alumnos
 */
const listarAlumnos = asyncHandler(async (req, res) => {
  const alumnos = await getAll()

  res.status(200).json({
    success: true,
    count: alumnos.length,
    data: alumnos
  })
})

/**
 * GET /api/alumnos/:id
 * Obtener un alumno por ID
 */
const obtenerAlumno = asyncHandler(async (req, res) => {
  const alumno = await getById(req.params.id)

  res.status(200).json({
    success: true,
    data: alumno
  })
})

/**
 * POST /api/alumnos
 * Crear un nuevo alumno
 */
const crearAlumno = asyncHandler(async (req, res) => {
  const { nombre, email, telefono, aulaId } = req.body

  const alumno = await create({ nombre, email, telefono, aulaId })

  res.status(201).json({
    success: true,
    message: 'Alumno creado exitosamente',
    data: alumno
  })
})

/**
 * PUT /api/alumnos/:id
 * Actualizar un alumno
 */
const actualizarAlumno = asyncHandler(async (req, res) => {
  const { nombre, email, telefono, aulaId } = req.body

  const alumno = await update(req.params.id, { nombre, email, telefono, aulaId })

  res.status(200).json({
    success: true,
    message: 'Alumno actualizado exitosamente',
    data: alumno
  })
})

/**
 * DELETE /api/alumnos/:id
 * Eliminar un alumno
 */
const eliminarAlumno = asyncHandler(async (req, res) => {
  await remove(req.params.id)

  res.status(200).json({
    success: true,
    message: 'Alumno eliminado exitosamente'
  })
})

module.exports = {
  listarAlumnos,
  obtenerAlumno,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno
}
