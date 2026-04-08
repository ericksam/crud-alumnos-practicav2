/**
 * Configuración centralizada de variables de entorno
 * Tipado y valores por defecto
 */

// Cargar dotenv primero
require('dotenv').config()

// Helper para obtener valor con default
const getEnv = (key, defaultValue) => process.env[key] || defaultValue

// Configuración centralizada
const config = {
  // Base de datos
  DATABASE_URL: getEnv('DATABASE_URL', ''),
  
  // JWT
  JWT_SECRET: getEnv('JWT_SECRET', 'secret-temporal-cambiar-en-produccion'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  
  // Servidor
  PORT: parseInt(getEnv('PORT', '3000')),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  
  // CORS
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  
  // bcrypt
  BCRYPT_ROUNDS: parseInt(getEnv('BCRYPT_ROUNDS', '10'))
}

module.exports = config
