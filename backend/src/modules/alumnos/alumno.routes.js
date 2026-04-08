/**
 * Rutas de alumnos
 */

const express = require('express')
const router = express.Router()
const { 
  listarAlumnos, 
  obtenerAlumno, 
  crearAlumno, 
  actualizarAlumno, 
  eliminarAlumno 
} = require('./alumno.controller')
const { validate } = require('../../middleware/validate')
const { authenticate } = require('../../middleware/auth')
const { createValidation, updateValidation, idValidation } = require('./alumno.validations')

// Todas las rutas requieren autenticación
router.use(authenticate)

// GET /api/alumnos - Listar todos
router.get('/', listarAlumnos)

// GET /api/alumnos/:id - Obtener uno
router.get('/:id', idValidation, validate(idValidation), obtenerAlumno)

// POST /api/alumnos - Crear
router.post('/', createValidation, validate(createValidation), crearAlumno)

// PUT /api/alumnos/:id - Actualizar
router.put('/:id', updateValidation, validate(updateValidation), actualizarAlumno)

// DELETE /api/alumnos/:id - Eliminar
router.delete('/:id', idValidation, validate(idValidation), eliminarAlumno)

module.exports = router
