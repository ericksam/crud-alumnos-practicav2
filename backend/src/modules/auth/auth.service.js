/**
 * Auth Service
 * Lógica de negocio para autenticación
 */

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../../database/prisma')
const config = require('../../config')
const AppError = require('../../utils/AppError')

/**
 * Registrar un nuevo usuario
 */
const register = async (email, password) => {
  // 1. Verificar si el email ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new AppError('El email ya está registrado', 400)
  }

  // 2. Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS)

  // 3. Crear el usuario
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      createdAt: true
    }
  })

  return user
}

/**
 * Iniciar sesión
 */
const login = async (email, password) => {
  // 1. Buscar usuario por email
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new AppError('Credenciales inválidas', 401)
  }

  // 2. Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new AppError('Credenciales inválidas', 401)
  }

  // 3. Generar JWT
  const token = jwt.sign(
    { userId: user.id },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  )

  return {
    user: {
      id: user.id,
      email: user.email
    },
    token
  }
}

module.exports = {
  register,
  login
}
