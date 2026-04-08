/**
 * Middleware de autenticación JWT
 * Verifica el token en cada request protegida
 */

const jwt = require('jsonwebtoken')
const config = require('../config')
const AppError = require('../utils/AppError')

/**
 * Middleware para proteger rutas
 * Verifica que exista un token válido en el header Authorization
 */
const authenticate = (req, res, next) => {
  try {
    // 1. Extraer el header de autorización
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError('No se proporcionó token de autenticación', 401)
    }

    // 2. Verificar formato: "Bearer <token>"
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Formato de token inválido. Usa: Bearer <token>', 401)
    }

    const token = authHeader.substring(7) // Quitar "Bearer "

    if (!token) {
      throw new AppError('Token no proporcionado', 401)
    }

    // 3. Verificar el token
    const decoded = jwt.verify(token, config.JWT_SECRET)

    // 4. Adjuntar la info del usuario al request
    req.user = {
      userId: decoded.userId
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401))
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401))
    }
    next(error)
  }
}

module.exports = { authenticate }
