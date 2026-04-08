/**
 * InscripcionesPage - Gestión de inscripciones
 */

import { useState, useEffect } from 'react'
import Swal from '../utils/swalConfig'
import inscripcionService from '../services/inscripcionService'
import alumnoService from '../services/alumnoService'
import cursoService from '../services/cursoService'

const InscripcionesPage = () => {
  const [inscripciones, setInscripciones] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal de crear
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ 
    alumnoId: '', 
    cursoId: '' 
  })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Cargar datos
  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [inscRes, alumRes, curRes] = await Promise.all([
        inscripcionService.getAll(),
        alumnoService.getAll(),
        cursoService.getAll()
      ])
      
      setInscripciones(inscRes.data || [])
      setAlumnos(alumRes.data || [])
      setCursos(curRes.data || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Abrir modal para crear
  const openCreateModal = () => {
    setFormData({ alumnoId: '', cursoId: '' })
    setFormErrors({})
    setShowModal(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false)
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.alumnoId) {
      newErrors.alumnoId = 'Seleccioná un alumno'
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.alumnoId)) {
      newErrors.alumnoId = 'Alumno inválido'
    }

    if (!formData.cursoId) {
      newErrors.cursoId = 'Seleccioná un curso'
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.cursoId)) {
      newErrors.cursoId = 'Curso inválido'
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Crear inscripción
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      await inscripcionService.create(formData)
      Swal.fire({
        icon: 'success',
        title: '¡Inscripción creada!',
        text: 'El alumno fue inscrito correctamente',
        timer: 2000,
        showConfirmButton: false
      })
      closeModal()
      fetchData()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'No se pudo crear la inscripción'
      })
    } finally {
      setSaving(false)
    }
  }

  // Eliminar inscripción
  const handleDelete = async (id, nombreAlumno, nombreCurso) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar inscripción?',
      text: `${nombreAlumno} será dado de baja de ${nombreCurso}`,
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-trash3"></i> Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await inscripcionService.delete(id)
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'La inscripción fue eliminada',
          timer: 2000,
          showConfirmButton: false
        })
        fetchData()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'No se pudo eliminar'
        })
      }
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="page-container fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Inscripciones</h1>
          <p className="text-muted mb-0">Gestionar inscripciones de alumnos a cursos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-person-plus me-2"></i>
          Nueva Inscripción
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : inscripciones.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h5 className="card-title text-muted">No hay inscripciones</h5>
            <p className="card-text">Inscribí al primer alumno a un curso</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <i className="bi bi-person-plus me-2"></i>
              Nueva Inscripción
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Email</th>
                  <th>Curso</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inscripciones.map(insc => (
                  <tr key={insc.id}>
                    <td>{insc.alumno?.nombre}</td>
                    <td>{insc.alumno?.email}</td>
                    <td>
                      <span className="badge bg-info">
                        {insc.curso?.nombre}
                      </span>
                    </td>
                    <td>{formatDate(insc.fechaInscripcion)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(
                          insc.id,
                          insc.alumno?.nombre,
                          insc.curso?.nombre
                        )}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal crear inscripción */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Nueva Inscripción
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeModal}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="alumnoId" className="form-label">Alumno *</label>
                    <select
                      className={`form-select ${formErrors.alumnoId ? 'is-invalid' : ''}`}
                      id="alumnoId"
                      name="alumnoId"
                      value={formData.alumnoId}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar alumno...</option>
                      {alumnos.map(alumno => (
                        <option key={alumno.id} value={alumno.id}>
                          {alumno.nombre} ({alumno.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.alumnoId && (
                      <div className="invalid-feedback">{formErrors.alumnoId}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cursoId" className="form-label">Curso *</label>
                    <select
                      className={`form-select ${formErrors.cursoId ? 'is-invalid' : ''}`}
                      id="cursoId"
                      name="cursoId"
                      value={formData.cursoId}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar curso...</option>
                      {cursos.map(curso => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </select>
                    {formErrors.cursoId && (
                      <div className="invalid-feedback">{formErrors.cursoId}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Inscribiendo...' : 'Inscribir'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InscripcionesPage
