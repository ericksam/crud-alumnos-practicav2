/**
 * Validaciones para cursos
 */

const { body, param } = require('express-validator')

/**
 * Validaciones para crear curso
 */
const createValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,]+$/)
    .withMessage('El nombre contiene caracteres inválidos')
    .trim(),

  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede superar los 500 caracteres')
    .trim(),

  body('aulaId')
    .optional()
    .isUUID()
    .withMessage('ID de aula inválido')
]

/**
 * Validaciones para actualizar curso
 */
const updateValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de curso inválido'),

  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,]+$/)
    .withMessage('El nombre contiene caracteres inválidos')
    .trim(),

  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede superar los 500 caracteres')
    .trim(),

  body('aulaId')
    .optional()
    .isUUID()
    .withMessage('ID de aula inválido')
]

/**
 * Validaciones para obtener/eliminar curso
 */
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de curso inválido')
]

module.exports = {
  createValidation,
  updateValidation,
  idValidation
}
