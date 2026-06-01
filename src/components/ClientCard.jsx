import useTranslations from '../hooks/useTranslations'

function ClientCard({
  client,
  assignedPrograms,
  onDeleteClient,
  onEditClient,
}) {
  const { t } = useTranslations()

  function getTranslatedStatus(status) {
    switch (status) {
      case 'active':
        return t('active')

      case 'paused':
        return t('paused')

      case 'inactive':
        return t('inactive')

      default:
        return status
    }
  }

  return (
    <div
      className="client-row clickable"
      onClick={() => onEditClient(client)}
    >
      <div>
        <strong>
          {client.firstName} {client.lastName}
        </strong>
      </div>

      <span className={`status-badge ${client.status}`}>
        {getTranslatedStatus(client.status)}
      </span>

      <span>{client.phone || '-'}</span>

      <span>{client.goal || '-'}</span>

      <div className="assigned-programs-cell">
  {assignedPrograms.length > 0 ? (
    assignedPrograms.map((program) => (
      <span
        className="assigned-program-badge"
        key={program.programId}
      >
        {program.programName}
      </span>
    ))
  ) : (
    <span>-</span>
  )}
</div>

      <div className="client-row-actions">
        <button
          className="delete-icon-button"
          onClick={(event) => {
            event.stopPropagation()
            onDeleteClient(client.clientId)
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ClientCard