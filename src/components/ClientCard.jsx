import useTranslations from '../hooks/useTranslations'

function ClientCard({
  client,
  paymentHealth,
  activePackage,
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

  function openWhatsApp(event) {
    event.stopPropagation()

    if (!client.phone) {
      return
    }

    const cleanedPhone = client.phone.replace(/\s+/g, '')

    window.open(`https://wa.me/${cleanedPhone}`, '_blank')
  }

  function getPaymentHealthLabel() {
    switch (paymentHealth) {
      case 'paid':
        return t('allPaid')
      case 'partial':
        return t('partialPayments')
      case 'unpaid':
        return t('noPaymentsMade')
      default:
        return ''
    }
  }

  function getPaymentHealthClass() {
    switch (paymentHealth) {
      case 'paid':
        return 'paid'
      case 'partial':
        return 'paused'
      case 'unpaid':
        return 'unpaid'
      default:
        return ''
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

      <div>
        {client.phone ? (
          <button
            type="button"
            className="contact-action-button"
            onClick={openWhatsApp}
          >
            WhatsApp
          </button>
        ) : (
          <span>-</span>
        )}
      </div>

      <div>
        {activePackage ? (
          <span className="assigned-program-badge">
            {activePackage.packageName}

            <span className="package-counter">
              {activePackage.remainingSessions}/
              {activePackage.totalSessions}
            </span>
          </span>
        ) : (
          <span>-</span>
        )}
      </div>

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

      <div>
        {paymentHealth !== 'none' && (
          <span className={`status-badge ${getPaymentHealthClass()}`}>
            {getPaymentHealthLabel()}
          </span>
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