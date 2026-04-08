/**
 * Rutas de cursos
 */

const express = require('express')
const router = express.Router()
const { 
  listarCursos, 
  obtenerCurso, 
  crearCurso,
  actualizarCurso,
  eliminarCurso
} = require('./curso.controller')
const { validate } = require('../../middleware/validate')
const { authenticate } = require('../../middleware/auth')
const { createValidation, updateValidation, idValidation } = require('./curso.validations')

// Todas las rutas requieren autenticación
router.use(authenticate)

// GET /api/cursos - Listar todos
router.get('/', listarCursos)

// GET /api/cursos/:id - Obtener uno
router.get('/:id', idValidation, validate(idValidation), obtenerCurso)

// POST /api/cursos - Crear
router.post('/', createValidation, validate(createValidation), crearCurso)

// PUT /api/cursos/:id - Actualizar
router.put('/:id', updateValidation, validate(updateValidation), actualizarCurso)

// DELETE /api/cursos/:id - Eliminar
router.delete('/:id', idValidation, validate(idValidation), eliminarCurso)

module.exports = router
