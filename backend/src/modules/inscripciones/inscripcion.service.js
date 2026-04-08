/**
 * Inscripcion Service
 * Lógica de negocio para gestión de inscripciones
 */

const prisma = require('../../database/prisma')
const AppError = require('../../utils/AppError')

/**
 * Obtener todas las inscripciones
 */
const getAll = async () => {
  const inscripciones = await prisma.inscripcion.findMany({
    include: {
      alumno: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      curso: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    },
    orderBy: {
      fechaInscripcion: 'desc'
    }
  })

  return inscripciones
}

/**
 * Obtener una inscripción por ID
 */
const getById = async (id) => {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id },
    include: {
      alumno: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      curso: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    }
  })

  if (!inscripcion) {
    throw new AppError('Inscripción no encontrada', 404)
  }

  return inscripcion
}

/**
 * Obtener inscripciones por curso
 */
const getByCurso = async (cursoId) => {
  const inscripciones = await prisma.inscripcion.findMany({
    where: { cursoId },
    include: {
      alumno: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      curso: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    },
    orderBy: {
      fechaInscripcion: 'desc'
    }
  })

  return inscripciones
}

/**
 * Obtener inscripciones por alumno
 */
const getByAlumno = async (alumnoId) => {
  const inscripciones = await prisma.inscripcion.findMany({
    where: { alumnoId },
    include: {
      curso: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    },
    orderBy: {
      fechaInscripcion: 'desc'
    }
  })

  return inscripciones
}

/**
 * Crear una nueva inscripción
 */
const create = async (data) => {
  // Verificar que el alumno existe
  const alumno = await prisma.alumno.findUnique({
    where: { id: data.alumnoId }
  })

  if (!alumno) {
    throw new AppError('El alumno no existe', 400)
  }

  // Verificar que el curso existe
  const curso = await prisma.curso.findUnique({
    where: { id: data.cursoId }
  })

  if (!curso) {
    throw new AppError('El curso no existe', 400)
  }

  // Verificar si ya está inscrito (evitar duplicados)
  const existingInscripcion = await prisma.inscripcion.findUnique({
    where: {
      alumnoId_cursoId: {
        alumnoId: data.alumnoId,
        cursoId: data.cursoId
      }
    }
  })

  if (existingInscripcion) {
    throw new AppError('El alumno ya está inscrito en este curso', 400)
  }

  const inscripcion = await prisma.inscripcion.create({
    data: {
      alumnoId: data.alumnoId,
      cursoId: data.cursoId
    },
    include: {
      alumno: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      curso: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    }
  })

  return inscripcion
}

/**
 * Eliminar una inscripción
 */
const remove = async (id) => {
  // Verificar que la inscripción existe
  const existingInscripcion = await prisma.inscripcion.findUnique({
    where: { id }
  })

  if (!existingInscripcion) {
    throw new AppError('Inscripción no encontrada', 404)
  }

  await prisma.inscripcion.delete({
    where: { id }
  })

  return { message: 'Inscripción eliminada correctamente' }
}

module.exports = {
  getAll,
  getById,
  getByCurso,
  getByAlumno,
  create,
  remove
}
