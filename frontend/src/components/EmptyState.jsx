/**
 * EmptyState - Componente para mostrar cuando no hay datos
 */

const EmptyState = ({ 
  icon = 'bi-inbox', 
  title = 'No hay datos', 
  description = 'No se encontraron elementos para mostrar',
  actionLabel = 'Crear nuevo',
  onAction = null,
  emoji = null
}) => {
  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon">
        {emoji ? <span>{emoji}</span> : <i className={`bi ${icon}`}></i>}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          <i className="bi bi-plus-lg me-2"></i>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState