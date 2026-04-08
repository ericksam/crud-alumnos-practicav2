/**
 * Aula Controller
 * Maneja las requests HTTP para aulas
 */

const asyncHandler = require('../../utils/asyncHandler')
const { getAll, getById, create, update, remove } = require('./aula.service')

/**
 * GET /api/aulas
 * Obtener todas las aulas
 */
const listarAulas = asyncHandler(async (req, res) => {
  const aulas = await getAll()

  res.status(200).json({
    success: true,
    count: aulas.length,
    data: aulas
  })
})

/**
 * GET /api/aulas/:id
 * Obtener un aula por ID
 */
const obtenerAula = asyncHandler(async (req, res) => {
  const aula = await getById(req.params.id)

  res.status(200).json({
    success: true,
    data: aula
  })
})

/**
 * POST /api/aulas
 * Crear un nuevo aula
 */
const crearAula = asyncHandler(async (req, res) => {
  const { nombre } = req.body

  const aula = await create({ nombre })

  res.status(201).json({
    success: true,
    message: 'Aula creada exitosamente',
    data: aula
  })
})

/**
 * PUT /api/aulas/:id
 * Actualizar un aula
 */
const actualizarAula = asyncHandler(async (req, res) => {
  const { nombre } = req.body

  const aula = await update(req.params.id, { nombre })

  res.status(200).json({
    success: true,
    message: 'Aula actualizada exitosamente',
    data: aula
  })
})

/**
 * DELETE /api/aulas/:id
 * Eliminar un aula
 */
const eliminarAula = asyncHandler(async (req, res) => {
  await remove(req.params.id)

  res.status(200).json({
    success: true,
    message: 'Aula eliminada exitosamente'
  })
})

module.exports = {
  listarAulas,
  obtenerAula,
  crearAula,
  actualizarAula,
  eliminarAula
}
