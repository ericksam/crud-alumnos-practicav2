/**
 * Configuración de Express
 * Middlewares globales y rutas
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir requests desde el frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

// Parsear JSON en el body
app.use(express.json())

// Parsear form data (por si lo necesitas)
app.use(express.urlencoded({ extended: true }))

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ============================================
// RUTAS DE LA API
// ============================================

app.use('/api/auth', require('./modules/auth/auth.routes'))
app.use('/api/alumnos', require('./modules/alumnos/alumno.routes'))
app.use('/api/aulas', require('./modules/aulas/aula.routes'))
app.use('/api/cursos', require('./modules/cursos/curso.routes'))
app.use('/api/inscripciones', require('./modules/inscripciones/inscripcion.routes'))

// ============================================
// RUTA 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  })
})

// ============================================
// MANEJO GLOBAL DE ERRORES
// ============================================

app.use(errorHandler)

module.exports = app
