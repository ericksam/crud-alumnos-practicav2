/**
 * Rutas de autenticación
 */

const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('./auth.controller')
const { validate } = require('../../middleware/validate')
const { registerValidation, loginValidation } = require('./auth.validations')

// POST /api/auth/register
router.post('/register', validate(registerValidation), registerUser)

// POST /api/auth/login
router.post('/login', validate(loginValidation), loginUser)

module.exports = router
