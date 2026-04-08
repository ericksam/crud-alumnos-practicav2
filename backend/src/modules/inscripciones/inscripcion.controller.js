/**
 * Inscripcion Controller
 * Maneja las requests HTTP para inscripciones
 */

const asyncHandler = require('../../utils/asyncHandler')
const { 
  getAll, 
  getById, 
  getByCurso, 
  getByAlumno,
  create, 
  remove 
} = require('./inscripcion.service')

/**
 * GET /api/inscripciones
 * Obtener todas las inscripciones
 */
const listarInscripciones = asyncHandler(async (req, res) => {
  const inscripciones = await getAll()

  res.status(200).json({
    success: true,
    count: inscripciones.length,
    data: inscripciones
  })
})

/**
 * GET /api/inscripciones/:id
 * Obtener una inscripción por ID
 */
const obtenerInscripcion = asyncHandler(async (req, res) => {
  const inscripcion = await getById(req.params.id)

  res.status(200).json({
    success: true,
    data: inscripcion
  })
})

/**
 * GET /api/inscripciones/curso/:cursoId
 * Obtener inscripciones por curso
 */
const listarInscripcionesPorCurso = asyncHandler(async (req, res) => {
  const inscripciones = await getByCurso(req.params.cursoId)

  res.status(200).json({
    success: true,
    count: inscripciones.length,
    data: inscripciones
  })
})

/**
 * GET /api/inscripciones/alumno/:alumnoId
 * Obtener inscripciones por alumno
 */
const listarInscripcionesPorAlumno = asyncHandler(async (req, res) => {
  const inscripciones = await getByAlumno(req.params.alumnoId)

  res.status(200).json({
    success: true,
    count: inscripciones.length,
    data: inscripciones
  })
})

/**
 * POST /api/inscripciones
 * Crear una nueva inscripción
 */
const crearInscripcion = asyncHandler(async (req, res) => {
  const { alumnoId, cursoId } = req.body

  const inscripcion = await create({ alumnoId, cursoId })

  res.status(201).json({
    success: true,
    message: 'Inscripción creada exitosamente',
    data: inscripcion
  })
})

/**
 * DELETE /api/inscripciones/:id
 * Eliminar una inscripción
 */
const eliminarInscripcion = asyncHandler(async (req, res) => {
  await remove(req.params.id)

  res.status(200).json({
    success: true,
    message: 'Inscripción eliminada exitosamente'
  })
})

module.exports = {
  listarInscripciones,
  obtenerInscripcion,
  listarInscripcionesPorCurso,
  listarInscripcionesPorAlumno,
  crearInscripcion,
  eliminarInscripcion
}
