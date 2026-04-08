/**
 * DashboardPage - Panel principal profesional
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import alumnoService from '../services/alumnoService'
import aulaService from '../services/aulaService'
import cursoService from '../services/cursoService'
import inscripcionService from '../services/inscripcionService'

const DashboardPage = () => {
  const { user } = useAuth()
  
  const [stats, setStats] = useState({
    alumnos: 0,
    aulas: 0,
    cursos: 0,
    inscripciones: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [alumRes, aulaRes, curRes, inscrRes] = await Promise.all([
          alumnoService.getAll(),
          aulaService.getAll(),
          cursoService.getAll(),
          inscripcionService.getAll()
        ])
        
        setStats({
          alumnos: alumRes.data?.length || 0,
          aulas: aulaRes.data?.length || 0,
          cursos: curRes.data?.length || 0,
          inscripciones: inscrRes.data?.length || 0
        })
      } catch (err) {
        console.error('Error cargando estadísticas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Datos para las cards de métricas
  const metricCards = [
    {
      label: 'Alumnos',
      value: stats.alumnos,
      icon: 'bi-people-fill',
      color: 'primary',
      link: '/alumnos'
    },
    {
      label: 'Aulas',
      value: stats.aulas,
      icon: 'bi-building-fill',
      color: 'info',
      link: '/aulas'
    },
    {
      label: 'Cursos',
      value: stats.cursos,
      icon: 'bi-book-fill',
      color: 'success',
      link: '/cursos'
    },
    {
      label: 'Inscripciones',
      value: stats.inscripciones,
      icon: 'bi-clipboard-check-fill',
      color: 'warning',
      link: '/inscripciones'
    }
  ]

  // quick actions
  const quickActions = [
    {
      title: 'Alumnos',
      emoji: '👨‍🎓',
      description: 'Gestionar alumnos del sistema',
      link: '/alumnos',
      color: 'primary'
    },
    {
      title: 'Aulas',
      emoji: '🏫',
      description: 'Administrar aulas disponibles',
      link: '/aulas',
      color: 'info'
    },
    {
      title: 'Cursos',
      emoji: '📚',
      description: 'Gestionar cursos disponibles',
      link: '/cursos',
      color: 'success'
    },
    {
      title: 'Inscripciones',
      emoji: '📝',
      description: 'Inscribir alumnos a cursos',
      link: '/inscripciones',
      color: 'warning'
    }
  ]

  // Obtener iniciales del usuario
  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="page-container fade-in">
      {/* Header de bienvenida */}
      <div className="welcome-header mb-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="welcome-title">
              <span className="text-gradient">Bienvenido</span>
            </h1>
            <p className="welcome-subtitle">
              Panel de gestión académica
            </p>
          </div>
          <div className="user-welcome-badge">
            <span className="user-avatar-large">{userInitials}</span>
            <span className="user-greeting">Hola, {user?.email?.split('@')[0]}</span>
          </div>
        </div>
      </div>

      {/* Stats con loading */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-number"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="metrics-grid mb-5">
            {metricCards.map((metric, index) => (
              <Link 
                to={metric.link} 
                key={metric.label}
                className={`metric-card metric-${metric.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="metric-icon-wrapper">
                  <i className={`bi ${metric.icon}`}></i>
                </div>
                <div className="metric-content">
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-label">{metric.label}</span>
                </div>
                <div className="metric-arrow">
                  <i className="bi bi-arrow-right"></i>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="section-header mb-4">
            <h2 className="section-title">
              <i className="bi bi-lightning-charge-fill me-2"></i>
              Acceso rápido
            </h2>
          </div>

          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link 
                to={action.link} 
                key={action.title}
                className="action-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`action-icon action-${action.color}`}>
                  <span>{action.emoji}</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">
                  <i className="bi bi-chevron-right"></i>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage