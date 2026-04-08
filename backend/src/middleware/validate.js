/**
 * Wrapper para validaciones de express-validator
 * Envuelve los middlewares de validación y pasa solo si no hay errores
 */

const { validationResult } = require('express-validator')
const AppError = require('../utils/AppError')

/**
 * Middleware para validar el resultado de express-validator
 * Debe ir DESPUÉS de las validaciones en la ruta
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    
    if (errors.isEmpty()) {
      return next()
    }

    // Extraer mensajes de error
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }))

    next(new AppError('Error de validación', 400, errorMessages))
  }
}

module.exports = { validate }
