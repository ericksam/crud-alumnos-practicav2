/**
 * RegisterPage - Página de registro profesional
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmá la contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'No coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccessMessage('')

    if (!validateForm()) return

    setIsLoading(true)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage('¡Cuenta creada! Ahora podés iniciar sesión.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = {}
          data.errors.forEach(err => {
            backendErrors[err.field] = err.message
          })
          setErrors(backendErrors)
        } else {
          setServerError(data.message || 'Error al registrar')
        }
      }
    } catch (error) {
      setServerError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="brand-logo mb-3">
            <span style={{ fontSize: '3rem' }}>🎓</span>
          </div>
          <h1 className="login-title">Crear Cuenta</h1>
          <p className="login-subtitle">Registrate para comenzar</p>
        </div>

        {/* Errores */}
        {serverError && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            {successMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <i className="bi bi-envelope me-2"></i>
              Email
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-at"></i>
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <i className="bi bi-key me-2"></i>
              Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              <i className="bi bi-key-fill me-2"></i>
              Confirmar Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creando cuenta...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-muted mb-0">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="fw-semibold">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage