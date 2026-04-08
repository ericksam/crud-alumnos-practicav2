/**
 * Aula Service
 * Lógica de negocio para gestión de aulas
 */

const prisma = require('../../database/prisma')
const AppError = require('../../utils/AppError')

/**
 * Obtener todas las aulas
 */
const getAll = async () => {
  const aulas = await prisma.aula.findMany({
    include: {
      _count: {
        select: {
          alumnos: true,
          cursos: true
        }
      },
      cursos: {
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          _count: {
            select: {
              inscripciones: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Calcular total de alumnos inscritos (a través de los cursos)
  const aulasWithInscripciones = aulas.map(aula => {
    const totalInscripciones = aula.cursos.reduce((sum, curso) => {
      return sum + (curso._count?.inscripciones || 0)
    }, 0)
    
    return {
      ...aula,
      _count: {
        ...aula._count,
        inscripciones: totalInscripciones
      }
    }
  })

  return aulasWithInscripciones
}

/**
 * Obtener un aula por ID con sus alumnos y cursos
 */
const getById = async (id) => {
  const aula = await prisma.aula.findUnique({
    where: { id },
    include: {
      alumnos: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      cursos: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    }
  })

  if (!aula) {
    throw new AppError('Aula no encontrada', 404)
  }

  return aula
}

/**
 * Crear un nuevo aula
 */
const create = async (data) => {
  // Verificar si ya existe un aula con el mismo nombre
  const existingAula = await prisma.aula.findFirst({
    where: { nombre: data.nombre }
  })

  if (existingAula) {
    throw new AppError('Ya existe un aula con ese nombre', 400)
  }

  const aula = await prisma.aula.create({
    data: {
      nombre: data.nombre
    }
  })

  return aula
}

/**
 * Actualizar un aula
 */
const update = async (id, data) => {
  // Verificar que el aula existe
  const existingAula = await prisma.aula.findUnique({
    where: { id }
  })

  if (!existingAula) {
    throw new AppError('Aula no encontrada', 404)
  }

  // Verificar si ya existe otra aula con el mismo nombre
  const duplicateAula = await prisma.aula.findFirst({
    where: {
      nombre: data.nombre,
      NOT: { id }
    }
  })

  if (duplicateAula) {
    throw new AppError('Ya existe un aula con ese nombre', 400)
  }

  const aula = await prisma.aula.update({
    where: { id },
    data: {
      nombre: data.nombre
    }
  })

  return aula
}

/**
 * Eliminar un aula
 */
const remove = async (id) => {
  // Verificar que el aula existe
  const existingAula = await prisma.aula.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          alumnos: true,
          cursos: true
        }
      }
    }
  })

  if (!existingAula) {
    throw new AppError('Aula no encontrada', 404)
  }

  // Verificar si tiene alumnos o cursos asociados
  if (existingAula._count.alumnos > 0 || existingAula._count.cursos > 0) {
    throw new AppError(
      'No se puede eliminar el aula porque tiene alumnos o cursos asociados',
      400
    )
  }

  await prisma.aula.delete({
    where: { id }
  })

  return { message: 'Aula eliminada correctamente' }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}
