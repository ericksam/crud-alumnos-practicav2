/**
 * Validaciones para aulas
 */

const { body, param } = require('express-validator')

/**
 * Validaciones para crear aula
 */
const createValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
    .withMessage('El nombre solo puede contener letras, números y espacios')
    .trim()
]

/**
 * Validaciones para actualizar aula
 */
const updateValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de aula inválido'),

  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
    .withMessage('El nombre solo puede contener letras, números y espacios')
    .trim()
]

/**
 * Validaciones para obtener/eliminar aula
 */
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de aula inválido')
]

module.exports = {
  createValidation,
  updateValidation,
  idValidation
}
