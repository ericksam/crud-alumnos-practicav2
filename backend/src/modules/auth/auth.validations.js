/**
 * Validaciones para autenticación
 * Usamos express-validator
 */

const { body } = require('express-validator')

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .isLength({ max: 255 })
    .withMessage('El email no puede superar los 255 caracteres')
    .normalizeEmail()
    .trim(),

  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('La contraseña debe tener entre 6 y 100 caracteres')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
    .withMessage('La contraseña debe contener al menos una letra y un número')
    .trim()
]

/**
 * Validaciones para login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .trim(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .trim()
]

module.exports = {
  registerValidation,
  loginValidation
}
