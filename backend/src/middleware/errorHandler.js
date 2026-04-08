/**
 * Manejo global de errores
 * Captura todos los errores no manejados
 */

const config = require('../config')
const AppError = require('../utils/AppError')

/**
 * Middleware de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  // Logging en desarrollo
  if (config.NODE_ENV === 'development') {
    console.error('❌ Error:', err)
  }

  // Si es un AppError (error controlado)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.NODE_ENV === 'development' && { stack: err.stack })
    })
  }

  // Error de Prisma - Violación de unique constraint
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Ya existe un registro con ese valor único'
    })
  }

  // Error de Prisma - Registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro no encontrado'
    })
  }

  // Error de validación de Prisma
  if (err.code === 'P2009') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación en la consulta'
    })
  }

  // Error genérico (no controlado)
  console.error('Error no manejado:', err)
  
  res.status(500).json({
    success: false,
    message: config.NODE_ENV === 'development' 
      ? err.message 
      : 'Error interno del servidor'
  })
}

module.exports = { errorHandler }
