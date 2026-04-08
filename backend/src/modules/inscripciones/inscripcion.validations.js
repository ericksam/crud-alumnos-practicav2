/**
 * Validaciones para inscripciones
 */

const { body, param } = require('express-validator')

/**
 * Validaciones para crear inscripción
 */
const createValidation = [
  body('alumnoId')
    .notEmpty()
    .withMessage('El ID del alumno es requerido')
    .isUUID()
    .withMessage('ID de alumno inválido'),

  body('cursoId')
    .notEmpty()
    .withMessage('El ID del curso es requerido')
    .isUUID()
    .withMessage('ID de curso inválido')
]

/**
 * Validaciones para obtener/eliminar inscripción
 */
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de inscripción inválido')
]

/**
 * Validaciones para obtener por curso
 */
const cursoIdValidation = [
  param('cursoId')
    .isUUID()
    .withMessage('ID de curso inválido')
]

/**
 * Validaciones para obtener por alumno
 */
const alumnoIdValidation = [
  param('alumnoId')
    .isUUID()
    .withMessage('ID de alumno inválido')
]

module.exports = {
  createValidation,
  idValidation,
  cursoIdValidation,
  alumnoIdValidation
}
