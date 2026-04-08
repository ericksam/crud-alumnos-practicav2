/**
 * Validaciones para alumnos
 */

const { body, param } = require('express-validator')

/**
 * Validaciones para crear alumno
 */
const createValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .trim(),

  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .isLength({ max: 255 })
    .withMessage('El email no puede superar los 255 caracteres')
    .normalizeEmail()
    .trim(),

  body('telefono')
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 dígitos')
    .matches(/^[\d\s\-+]+$/)
    .withMessage('El teléfono solo puede contener números, espacios, guiones y +')
    .trim(),

  body('aulaId')
    .optional()
    .isUUID()
    .withMessage('ID de aula inválido')
]

/**
 * Validaciones para actualizar alumno
 */
const updateValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de alumno inválido'),

  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .trim(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .isLength({ max: 255 })
    .withMessage('El email no puede superar los 255 caracteres')
    .normalizeEmail()
    .trim(),

  body('telefono')
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 dígitos')
    .matches(/^[\d\s\-+]+$/)
    .withMessage('El teléfono solo puede contener números, espacios, guiones y +')
    .trim(),

  body('aulaId')
    .optional()
    .isUUID()
    .withMessage('ID de aula inválido')
]

/**
 * Validaciones para obtener/eliminar alumno
 */
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de alumno inválido')
]

module.exports = {
  createValidation,
  updateValidation,
  idValidation
}
