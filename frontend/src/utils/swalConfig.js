/**
 * Configuración personalizada de SweetAlert2
 * Para que coincida con el diseño profesional del sistema
 */

import Swal from 'sweetalert2'

// Inyectar estilos CSS personalizados
const swalStyles = `
  .swal2-popup {
    background: #14141c !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 16px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  }
  .swal2-title {
    color: #f1f5f9 !important;
    font-family: 'Space Grotesk', sans-serif !important;
    font-weight: 600 !important;
    font-size: 1.25rem !important;
  }
  .swal2-content {
    color: #94a3b8 !important;
    font-family: 'Outfit', sans-serif !important;
  }
  .swal2-input {
    background: #1a1a24 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    color: #f1f5f9 !important;
    border-radius: 10px !important;
    padding: 0.75rem 1rem !important;
  }
  .swal2-input:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
  }
  .swal2-confirm {
    background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
    border: none !important;
    font-family: 'Outfit', sans-serif !important;
    font-weight: 500 !important;
    border-radius: 10px !important;
    padding: 0.625rem 1.25rem !important;
  }
  .swal2-confirm:hover {
    background: linear-gradient(135deg, #818cf8, #6366f1) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45) !important;
  }
  .swal2-cancel {
    background: #2d2d2d !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    color: #f1f5f9 !important;
    font-family: 'Outfit', sans-serif !important;
    font-weight: 500 !important;
    border-radius: 10px !important;
    padding: 0.625rem 1.25rem !important;
  }
  .swal2-cancel:hover {
    background: #1e1e28 !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
  }
`

// Crear style element de forma segura
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style')
  styleEl.textContent = swalStyles
  document.head.appendChild(styleEl)
}

// Funciones helper
export const showSuccess = (title, text = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    background: '#14141c',
    color: '#f1f5f9',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Aceptar'
  })
}

export const showError = (title, text = '') => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    background: '#14141c',
    color: '#f1f5f9',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Aceptar'
  })
}

export const showWarning = (title, text = '') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    background: '#14141c',
    color: '#f1f5f9',
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'Aceptar'
  })
}

export const showInfo = (title, text = '') => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    background: '#14141c',
    color: '#f1f5f9',
    confirmButtonColor: '#6366f1',
    confirmButtonText: 'Aceptar'
  })
}

export const showDeleteConfirm = (itemName, itemType = 'elemento') => {
  return Swal.fire({
    icon: 'warning',
    title: `¿Eliminar ${itemType}?`,
    text: `"${itemName}" será eliminado permanentemente`,
    background: '#14141c',
    color: '#f1f5f9',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#2d2d2d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
}

// Exportar Swal tal cual para compatibilidad
export default Swal