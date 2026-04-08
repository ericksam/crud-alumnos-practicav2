/**
 * Curso Controller
 * Maneja las requests HTTP para cursos
 */

const asyncHandler = require('../../utils/asyncHandler')
const { getAll, getById, create, update, remove } = require('./curso.service')

/**
 * GET /api/cursos
 * Obtener todos los cursos
 */
const listarCursos = asyncHandler(async (req, res) => {
  const cursos = await getAll()

  res.status(200).json({
    success: true,
    count: cursos.length,
    data: cursos
  })
})

/**
 * GET /api/cursos/:id
 * Obtener un curso por ID
 */
const obtenerCurso = asyncHandler(async (req, res) => {
  const curso = await getById(req.params.id)

  res.status(200).json({
    success: true,
    data: curso
  })
})

/**
 * POST /api/cursos
 * Crear un nuevo curso
 */
const crearCurso = asyncHandler(async (req, res) => {
  const { nombre, descripcion, aulaId } = req.body

  const curso = await create({ nombre, descripcion, aulaId })

  res.status(201).json({
    success: true,
    message: 'Curso creado exitosamente',
    data: curso
  })
})

/**
 * PUT /api/cursos/:id
 * Actualizar un curso
 */
const actualizarCurso = asyncHandler(async (req, res) => {
  const { nombre, descripcion, aulaId } = req.body

  const curso = await update(req.params.id, { nombre, descripcion, aulaId })

  res.status(200).json({
    success: true,
    message: 'Curso actualizado exitosamente',
    data: curso
  })
})

/**
 * DELETE /api/cursos/:id
 * Eliminar un curso
 */
const eliminarCurso = asyncHandler(async (req, res) => {
  await remove(req.params.id)

  res.status(200).json({
    success: true,
    message: 'Curso eliminado exitosamente'
  })
})

module.exports = {
  listarCursos,
  obtenerCurso,
  crearCurso,
  actualizarCurso,
  eliminarCurso
}
