/**
 * AlumnosPage - Gestión de alumnos
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from '../utils/swalConfig'
import EmptyState from '../components/EmptyState'
import alumnoService from '../services/alumnoService'

const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal de crear/editar
  const [showModal, setShowModal] = useState(false)
  const [editingAlumno, setEditingAlumno] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Cargar alumnos
  const fetchAlumnos = async () => {
    try {
      setLoading(true)
      const data = await alumnoService.getAll()
      setAlumnos(data.data || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Error al cargar alumnos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlumnos()
  }, [])

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingAlumno(null)
    setFormData({ nombre: '', email: '', telefono: '' })
    setFormErrors({})
    setShowModal(true)
  }

  // Abrir modal para editar
  const openEditModal = (alumno) => {
    setEditingAlumno(alumno)
    setFormData({
      nombre: alumno.nombre,
      email: alumno.email,
      telefono: alumno.telefono || ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false)
    setEditingAlumno(null)
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
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre solo puede contener letras'
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.telefono && !/^[\d\s\-+]{8,20}$/.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido'
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
      if (editingAlumno) {
        await alumnoService.update(editingAlumno.id, formData)
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El alumno se actualizó correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await alumnoService.create(formData)
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'El alumno se creó correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      }
      closeModal()
      fetchAlumnos()
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

  // Eliminar alumno
  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar alumno?',
      text: `"${nombre}" será eliminado permanentemente`,
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-trash3"></i> Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await alumnoService.delete(id)
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El alumno fue eliminado',
          timer: 2000,
          showConfirmButton: false
        })
        fetchAlumnos()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Error al eliminar'
        })
      }
    }
  }

  return (
    <div className="page-container fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Alumnos</h1>
          <p className="text-muted mb-0">Gestionar alumnos del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-person-plus me-2"></i>
          Nuevo Alumno
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
      ) : alumnos.length === 0 ? (
        <EmptyState 
          emoji="👨‍🎓"
          title="No hay alumnos" 
          description="Agregá el primer alumno para comenzar"
          actionLabel="Nuevo Alumno"
          onAction={openCreateModal}
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map(alumno => (
                  <tr key={alumno.id}>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.email}</td>
                    <td>{alumno.telefono || '-'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(alumno)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(alumno.id, alumno.nombre)}
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
                  {editingAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}
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
                      placeholder="Juan Pérez"
                    />
                    {formErrors.nombre && (
                      <div className="invalid-feedback">{formErrors.nombre}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="juan@email.com"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.telefono ? 'is-invalid' : ''}`}
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+54 11 1234 5678"
                    />
                    {formErrors.telefono && (
                      <div className="invalid-feedback">{formErrors.telefono}</div>
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
    </div>
  )
}

export default AlumnosPage
