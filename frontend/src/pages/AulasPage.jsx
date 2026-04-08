/**
 * AulasPage - Gestión de aulas
 */

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import aulaService from '../services/aulaService'
import cursoService from '../services/cursoService'
import inscripcionService from '../services/inscripcionService'

const AulasPage = () => {
  const [aulas, setAulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal de crear/editar
  const [showModal, setShowModal] = useState(false)
  const [editingAula, setEditingAula] = useState(null)
  const [formData, setFormData] = useState({ nombre: '' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Modal de detalles
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailAula, setDetailAula] = useState(null)
  const [detailData, setDetailData] = useState({ cursos: [], inscripciones: [] })
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Cargar aulas
  const fetchAulas = async () => {
    try {
      setLoading(true)
      const data = await aulaService.getAll()
      setAulas(data.data || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Error al cargar aulas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAulas()
  }, [])

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingAula(null)
    setFormData({ nombre: '' })
    setFormErrors({})
    setShowModal(true)
  }

  // Abrir modal para editar
  const openEditModal = (aula) => {
    setEditingAula(aula)
    setFormData({ nombre: aula.nombre })
    setFormErrors({})
    setShowModal(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false)
    setEditingAula(null)
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede superar los 100 caracteres'
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'Solo letras, números y espacios'
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      if (editingAula) {
        await aulaService.update(editingAula.id, formData)
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El aula se actualizó correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await aulaService.create(formData)
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'El aula se creó correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      }
      closeModal()
      fetchAulas()
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const backendErrors = {}
        err.errors.forEach(er => {
          backendErrors[er.field] = er.message
        })
        setFormErrors(backendErrors)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Error al guardar'
        })
      }
    } finally {
      setSaving(false)
    }
  }

  // Eliminar aula
  const handleDelete = async (id, nombre, countAlumnos, countCursos) => {
    if (countAlumnos > 0 || countCursos > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede eliminar',
        text: `El aula "${nombre}" tiene ${countAlumnos} alumno(s) y ${countCursos} curso(s) asociados`
      })
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar aula?',
      text: `"${nombre}" será eliminada permanentemente`,
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-trash3"></i> Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await aulaService.delete(id)
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El aula fue eliminada',
          timer: 2000,
          showConfirmButton: false
        })
        fetchAulas()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Error al eliminar'
        })
      }
    }
  }

  // Ver detalle del aula
  const handleViewDetail = async (aula) => {
    setDetailAula(aula)
    setShowDetailModal(true)
    setLoadingDetail(true)

    try {
      // Obtener todos los cursos
      const cursosRes = await cursoService.getAll()
      const cursosDelAula = cursosRes.data?.filter(c => c.aulaId === aula.id) || []

      // Obtener inscripciones de esos cursos
      let todasInscripciones = []
      for (const curso of cursosDelAula) {
        const inscrRes = await inscripcionService.getByCurso(curso.id)
        todasInscripciones = [...todasInscripciones, ...(inscrRes.data || [])]
      }

      setDetailData({
        cursos: cursosDelAula,
        inscripciones: todasInscripciones
      })
    } catch (err) {
      console.error('Error cargando detalles:', err)
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <div className="page-container fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Aulas</h1>
          <p className="text-muted mb-0">Gestionar aulas del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-building-add me-2"></i>
          Nueva Aula
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
      ) : aulas.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h5 className="card-title text-muted">No hay aulas</h5>
            <p className="card-text">Agregá la primera aula para comenzar</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <i className="bi bi-building-add me-2"></i>
              Nueva Aula
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Alumnos</th>
                  <th>Cursos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aulas.map(aula => (
                  <tr 
                    key={aula.id}
                    onClick={() => handleViewDetail(aula)}
                    style={{ cursor: 'pointer' }}
                    title="Ver detalles"
                  >
                    <td>{aula.nombre}</td>
                    <td>
                      <span className="badge bg-info">
                        {aula._count?.inscripciones || 0}
                      </span>
                    </td>
                    <td>
                      {aula.cursos?.length > 0 ? (
                        <span className="badge bg-secondary">
                          {aula.cursos.map(c => c.nombre).join(', ')}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Sin cursos</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(aula)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(
                          aula.id, 
                          aula.nombre,
                          aula._count?.inscripciones || 0,
                          aula._count?.cursos || 0
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

      {/* Modal crear/editar */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAula ? 'Editar Aula' : 'Nueva Aula'}
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
                    <label htmlFor="nombre" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: 1° Año A"
                    />
                    {formErrors.nombre && (
                      <div className="invalid-feedback">{formErrors.nombre}</div>
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
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de detalles del aula */}
      {showDetailModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalles: {detailAula?.nombre}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDetailModal(false)}
                />
              </div>
              <div className="modal-body">
                {loadingDetail ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h6><i className="bi bi-book me-2"></i>Cursos del aula ({detailData.cursos.length}):</h6>
                      {detailData.cursos.length === 0 ? (
                        <p className="text-muted">No hay cursos en esta aula</p>
                      ) : (
                        <ul className="list-group mb-3">
                          {detailData.cursos.map(curso => (
                            <li key={curso.id} className="list-group-item">
                              <strong>{curso.nombre}</strong>
                              {curso.descripcion && <span className="text-muted"> - {curso.descripcion}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div>
                      <h6><i className="bi bi-people me-2"></i>Alumnos inscritos en los cursos ({detailData.inscripciones.length}):</h6>
                      {detailData.inscripciones.length === 0 ? (
                        <p className="text-muted">No hay alumnos inscritos en los cursos de esta aula</p>
                      ) : (
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th>Alumno</th>
                              <th>Email</th>
                              <th>Curso</th>
                              <th>Fecha inscripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailData.inscripciones.map(inscr => (
                              <tr key={inscr.id}>
                                <td>{inscr.alumno?.nombre}</td>
                                <td>{inscr.alumno?.email}</td>
                                <td><span className="badge bg-info">{inscr.curso?.nombre}</span></td>
                                <td>{new Date(inscr.fechaInscripcion).toLocaleDateString('es-AR')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AulasPage
