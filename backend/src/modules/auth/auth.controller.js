/**
 * Auth Controller
 * Maneja las requests HTTP para autenticación
 */

const asyncHandler = require('../../utils/asyncHandler')
const { register, login } = require('./auth.service')

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await register(email, password)

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: user
  })
})

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const result = await login(email, password)

  res.status(200).json({
    success: true,
    message: 'Login exitoso',
    data: result
  })
})

module.exports = {
  registerUser,
  loginUser
}
