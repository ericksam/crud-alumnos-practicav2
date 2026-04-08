/**
 * Rutas de aulas
 */

const express = require('express')
const router = express.Router()
const { 
  listarAulas, 
  obtenerAula, 
  crearAula,
  actualizarAula,
  eliminarAula
} = require('./aula.controller')
const { validate } = require('../../middleware/validate')
const { authenticate } = require('../../middleware/auth')
const { createValidation, updateValidation, idValidation } = require('./aula.validations')

// Todas las rutas requieren autenticación
router.use(authenticate)

// GET /api/aulas - Listar todas
router.get('/', listarAulas)

// GET /api/aulas/:id - Obtener una
router.get('/:id', idValidation, validate(idValidation), obtenerAula)

// POST /api/aulas - Crear
router.post('/', createValidation, validate(createValidation), crearAula)

// PUT /api/aulas/:id - Actualizar
router.put('/:id', updateValidation, validate(updateValidation), actualizarAula)

// DELETE /api/aulas/:id - Eliminar
router.delete('/:id', idValidation, validate(idValidation), eliminarAula)

module.exports = router
