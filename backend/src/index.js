/**
 * Entry point del servidor
 * Boot de la aplicación
 */

require('dotenv').config()
const app = require('./app')
const prisma = require('./database/prisma')

const PORT = process.env.PORT || 3000

async function main() {
  try {
    // Probar conexión con la base de datos
    await prisma.$connect()
    console.log('✅ Conexión a PostgreSQL exitosa')

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

// Manejar apagado graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Apagando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Apagando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

main()
