/**
 * CursosPage - Gestión de cursos
 */

import { useState, useEffect } from 'react'
import Swal from '../utils/swalConfig'
import cursoService from '../services/cursoService'
import aulaService from '../services/aulaService'
import inscripcionService from '../services/inscripcionService'

const CursosPage = () => {
  const [cursos, setCursos] = useState([])
  const [aulas, setAulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal de crear/editar
  const [showModal, setShowModal] = useState(false)
  const [editingCurso, setEditingCurso] = useState(null)
  const [formData, setFormData] = useState({ 
    nombre: '', 
    descripcion: '', 
    aulaId: '' 
  })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Modal de detalles
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailCurso, setDetailCurso] = useState(null)
  const [detailData, setDetailData] = useState({ aula: null, inscripciones: [] })
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Cargar cursos y aulas
  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [cursosRes, aulasRes] = await Promise.all([
        cursoService.getAll(),
        aulaService.getAll()
      ])
      
      setCursos(cursosRes.data || [])
      setAulas(aulasRes.data || [])
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
    setEditingCurso(null)
    setFormData({ nombre: '', descripcion: '', aulaId: '' })
    setFormErrors({})
    setShowModal(true)
  }

  // Abrir modal para editar
  const openEditModal = (curso) => {
    setEditingCurso(curso)
    setFormData({ 
      nombre: curso.nombre, 
      descripcion: curso.descripcion || '', 
      aulaId: curso.aulaId || '' 
    })
    setFormErrors({})
    setShowModal(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false)
    setEditingCurso(null)
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
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede superar los 500 caracteres'
    }

    if (formData.aulaId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.aulaId)) {
      newErrors.aulaId = 'ID de aula inválido'
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      aulaId: formData.aulaId || null
    }

    setSaving(true)
    try {
      if (editingCurso) {
        await cursoService.update(editingCurso.id, dataToSend)
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El curso se actualizó correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await cursoService.create(dataToSend)
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'El curso se creó correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      }
      closeModal()
      fetchData()
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

  // Eliminar curso
  const handleDelete = async (id, nombre, countInscripciones) => {
    if (countInscripciones > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede eliminar',
        text: `El curso "${nombre}" tiene ${countInscripciones} alumno(s) inscrito(s)`
      })
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar curso?',
      text: `"${nombre}" será eliminado permanentemente`,
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-trash3"></i> Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await cursoService.delete(id)
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El curso fue eliminado',
          timer: 2000,
          showConfirmButton: false
        })
        fetchData()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Error al eliminar'
        })
      }
    }
  }

  // Ver detalle del curso
  const handleViewDetail = async (curso) => {
    setDetailCurso(curso)
    setShowDetailModal(true)
    setLoadingDetail(true)

    try {
      const inscrRes = await inscripcionService.getByCurso(curso.id)
      setDetailData({
        aula: curso.aula || null,
        inscripciones: inscrRes.data || []
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
          <h1 className="mb-1">Cursos</h1>
          <p className="text-muted mb-0">Gestionar cursos del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-book-plus me-2"></i>
          Nuevo Curso
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
      ) : cursos.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h5 className="card-title text-muted">No hay cursos</h5>
            <p className="card-text">Agregá el primer curso para comenzar</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <i className="bi bi-book-plus me-2"></i>
              Nuevo Curso
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
                  <th>Descripción</th>
                  <th>Aula</th>
                  <th>Alumnos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map(curso => (
                  <tr 
                    key={curso.id} 
                    onClick={() => handleViewDetail(curso)}
                    style={{ cursor: 'pointer' }}
                    title="Ver detalles"
                  >
                    <td>{curso.nombre}</td>
                    <td>{curso.descripcion || '-'}</td>
                    <td>
                      {curso.aula ? (
                        <span className="badge bg-info">{curso.aula.nombre}</span>
                      ) : (
                        <span className="text-muted">Sin asignar</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {curso._count?.inscripciones || 0}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(curso)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(
                          curso.id, 
                          curso.nombre,
                          curso._count?.inscripciones || 0
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
                  {editingCurso ? 'Editar Curso' : 'Nuevo Curso'}
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
                      placeholder="Ej: Matemática 1° Año"
                    />
                    {formErrors.nombre && (
                      <div className="invalid-feedback">{formErrors.nombre}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                      className={`form-control ${formErrors.descripcion ? 'is-invalid' : ''}`}
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Descripción del curso (opcional)"
                      rows="3"
                    />
                    {formErrors.descripcion && (
                      <div className="invalid-feedback">{formErrors.descripcion}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="aulaId" className="form-label">Aula</label>
                    <select
                      className={`form-select ${formErrors.aulaId ? 'is-invalid' : ''}`}
                      id="aulaId"
                      name="aulaId"
                      value={formData.aulaId}
                      onChange={handleChange}
                    >
                      <option value="">Sin asignar</option>
                      {aulas.map(aula => (
                        <option key={aula.id} value={aula.id}>
                          {aula.nombre}
                        </option>
                      ))}
                    </select>
                    {formErrors.aulaId && (
                      <div className="invalid-feedback">{formErrors.aulaId}</div>
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
      
      {/* Modal de detalles del curso */}
      {showDetailModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalles: {detailCurso?.nombre}
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
                      <h6><i className="bi bi-building me-2"></i>Aula asignada:</h6>
                      {detailData.aula ? (
                        <span className="badge bg-info fs-6">{detailData.aula.nombre}</span>
                      ) : (
                        <span className="text-muted">Sin aula asignada</span>
                      )}
                    </div>
                    
                    <div>
                      <h6><i className="bi bi-people me-2"></i>Alumnos inscritos ({detailData.inscripciones.length}):</h6>
                      {detailData.inscripciones.length === 0 ? (
                        <p className="text-muted">No hay alumnos inscritos</p>
                      ) : (
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>Email</th>
                              <th>Fecha inscripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailData.inscripciones.map(inscr => (
                              <tr key={inscr.id}>
                                <td>{inscr.alumno?.nombre}</td>
                                <td>{inscr.alumno?.email}</td>
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

export default CursosPage
