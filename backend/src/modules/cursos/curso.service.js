/**
 * Curso Service
 * Lógica de negocio para gestión de cursos
 */

const prisma = require('../../database/prisma')
const AppError = require('../../utils/AppError')

/**
 * Obtener todos los cursos
 */
const getAll = async () => {
  const cursos = await prisma.curso.findMany({
    include: {
      aula: {
        select: {
          id: true,
          nombre: true
        }
      },
      _count: {
        select: {
          inscripciones: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return cursos
}

/**
 * Obtener un curso por ID con sus alumnos
 */
const getById = async (id) => {
  const curso = await prisma.curso.findUnique({
    where: { id },
    include: {
      aula: {
        select: {
          id: true,
          nombre: true
        }
      },
      inscripciones: {
        include: {
          alumno: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!curso) {
    throw new AppError('Curso no encontrado', 404)
  }

  return curso
}

/**
 * Crear un nuevo curso
 */
const create = async (data) => {
  // Si proporciona aulaId, verificar que exista
  if (data.aulaId) {
    const aula = await prisma.aula.findUnique({
      where: { id: data.aulaId }
    })
    if (!aula) {
      throw new AppError('El aula especificada no existe', 400)
    }
  }

  const curso = await prisma.curso.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      aulaId: data.aulaId || null
    },
    include: {
      aula: {
        select: {
          id: true,
          nombre: true
        }
      }
    }
  })

  return curso
}

/**
 * Actualizar un curso
 */
const update = async (id, data) => {
  // Verificar que el curso existe
  const existingCurso = await prisma.curso.findUnique({
    where: { id }
  })

  if (!existingCurso) {
    throw new AppError('Curso no encontrado', 404)
  }

  // Si proporciona aulaId, verificar que exista
  if (data.aulaId) {
    const aula = await prisma.aula.findUnique({
      where: { id: data.aulaId }
    })
    if (!aula) {
      throw new AppError('El aula especificada no existe', 400)
    }
  }

  const curso = await prisma.curso.update({
    where: { id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion !== undefined ? data.descripcion : null,
      aulaId: data.aulaId || null
    },
    include: {
      aula: {
        select: {
          id: true,
          nombre: true
        }
      }
    }
  })

  return curso
}

/**
 * Eliminar un curso
 */
const remove = async (id) => {
  // Verificar que el curso existe
  const existingCurso = await prisma.curso.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          inscripciones: true
        }
      }
    }
  })

  if (!existingCurso) {
    throw new AppError('Curso no encontrado', 404)
  }

  // Verificar si tiene inscripciones
  if (existingCurso._count.inscripciones > 0) {
    throw new AppError(
      'No se puede eliminar el curso porque tiene alumnos inscritos',
      400
    )
  }

  await prisma.curso.delete({
    where: { id }
  })

  return { message: 'Curso eliminado correctamente' }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}
