/**
 * Navbar - Barra de navegación profesional
 */

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  // Links del menú
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { path: '/alumnos', label: 'Alumnos', icon: 'bi-people' },
    { path: '/aulas', label: 'Aulas', icon: 'bi-building' },
    { path: '/cursos', label: 'Cursos', icon: 'bi-book' },
    { path: '/inscripciones', label: 'Inscripciones', icon: 'bi-clipboard-check' },
  ]

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link className="navbar-brand" to="/dashboard">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Acad<span className="text-gradient">emic</span></span>
        </Link>
        
        {/* Botón hamburguesa */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link 
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  to={link.path}
                >
                  <i className={`${link.icon} me-2`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Usuario y logout */}
          <div className="d-flex align-items-center gap-3">
            <div className="user-info">
              <span className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className="user-email">
                {user?.email}
              </span>
            </div>
            <button 
              className="btn btn-logout" 
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              <span className="d-none d-md-inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar