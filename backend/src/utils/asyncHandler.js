/**
 * Wrapper para manejar async/await sin try-catch en cada controller
 * Captura errores y los pasa al middleware de errores
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = asyncHandler
