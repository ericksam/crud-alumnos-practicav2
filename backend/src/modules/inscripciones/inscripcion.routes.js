/**
 * Rutas de inscripciones
 */

const express = require('express')
const router = express.Router()
const { 
  listarInscripciones, 
  obtenerInscripcion,
  listarInscripcionesPorCurso,
  listarInscripcionesPorAlumno,
  crearInscripcion, 
  eliminarInscripcion 
} = require('./inscripcion.controller')
const { validate } = require('../../middleware/validate')
const { authenticate } = require('../../middleware/auth')
const { 
  createValidation, 
  idValidation,
  cursoIdValidation,
  alumnoIdValidation 
} = require('./inscripcion.validations')

// Todas las rutas requieren autenticación
router.use(authenticate)

// GET /api/inscripciones - Listar todas
router.get('/', listarInscripciones)

// GET /api/inscripciones/:id - Obtener una
router.get('/:id', idValidation, validate(idValidation), obtenerInscripcion)

// GET /api/inscripciones/curso/:cursoId - Listar por curso
router.get('/curso/:cursoId', cursoIdValidation, validate(cursoIdValidation), listarInscripcionesPorCurso)

// GET /api/inscripciones/alumno/:alumnoId - Listar por alumno
router.get('/alumno/:alumnoId', alumnoIdValidation, validate(alumnoIdValidation), listarInscripcionesPorAlumno)

// POST /api/inscripciones - Crear
router.post('/', createValidation, validate(createValidation), crearInscripcion)

// DELETE /api/inscripciones/:id - Eliminar
router.delete('/:id', idValidation, validate(idValidation), eliminarInscripcion)

module.exports = router
