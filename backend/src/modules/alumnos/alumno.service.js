/**
 * Alumno Service
 * Lógica de negocio para gestión de alumnos
 */

const prisma = require('../../database/prisma')
const AppError = require('../../utils/AppError')

/**
 * Obtener todos los alumnos
 */
const getAll = async () => {
  const alumnos = await prisma.alumno.findMany({
    include: {
      aula: {
        select: {
          id: true,
          nombre: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return alumnos
}

/**
 * Obtener un alumno por ID
 */
const getById = async (id) => {
  const alumno = await prisma.alumno.findUnique({
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
          curso: {
            select: {
              id: true,
              nombre: true
            }
          }
        }
      }
    }
  })

  if (!alumno) {
    throw new AppError('Alumno no encontrado', 404)
  }

  return alumno
}

/**
 * Crear un nuevo alumno
 */
const create = async (data) => {
  // Verificar si el email ya existe
  const existingAlumno = await prisma.alumno.findUnique({
    where: { email: data.email }
  })

  if (existingAlumno) {
    throw new AppError('El email ya está registrado en otro alumno', 400)
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

  const alumno = await prisma.alumno.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono || null,
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

  return alumno
}

/**
 * Actualizar un alumno
 */
const update = async (id, data) => {
  // Verificar que el alumno existe
  const existingAlumno = await prisma.alumno.findUnique({
    where: { id }
  })

  if (!existingAlumno) {
    throw new AppError('Alumno no encontrado', 404)
  }

  // Si cambia el email, verificar que no esté en uso
  if (data.email && data.email !== existingAlumno.email) {
    const emailInUse = await prisma.alumno.findUnique({
      where: { email: data.email }
    })
    if (emailInUse) {
      throw new AppError('El email ya está registrado en otro alumno', 400)
    }
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

  const alumno = await prisma.alumno.update({
    where: { id },
    data: {
      nombre: data.nombre ?? existingAlumno.nombre,
      email: data.email ?? existingAlumno.email,
      telefono: data.telefono !== undefined ? data.telefono : existingAlumno.telefono,
      aulaId: data.aulaId !== undefined ? data.aulaId : existingAlumno.aulaId
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

  return alumno
}

/**
 * Eliminar un alumno
 */
const remove = async (id) => {
  const alumno = await prisma.alumno.findUnique({
    where: { id }
  })

  if (!alumno) {
    throw new AppError('Alumno no encontrado', 404)
  }

  await prisma.alumno.delete({
    where: { id }
  })

  return { message: 'Alumno eliminado exitosamente' }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}
