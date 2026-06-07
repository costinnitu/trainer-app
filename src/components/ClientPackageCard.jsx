import useTranslations from '../hooks/useTranslations'

function ClientPackageCard({
  clientPackage,
  onEditPackage,
  onDeletePackage,
}) {
  const { t } = useTranslations()

  function getSessionStatus() {
    const remaining = Number(clientPackage.remainingSessions || 0)

    if (remaining === 0) {
      return 'exhausted'
    }

    if (remaining === 1) {
      return 'last'
    }

    if (remaining <= 3) {
      return 'low'
    }

    return 'healthy'
  }

  function getSessionStatusLabel() {
    const remaining = Number(clientPackage.remainingSessions || 0)

    if (remaining === 0) {
      return t('exhausted')
    }

    if (remaining === 1) {
      return t('lastSession')
    }

    if (remaining <= 3) {
      return t('lowSessions')
    }

    return t('healthy')
  }

  return (
    <div
      className="client-row clickable"
      onClick={() => onEditPackage(clientPackage)}
    >
      <strong>{clientPackage.clientName}</strong>

      <span>{clientPackage.packageName}</span>

      <span>
        {clientPackage.remainingSessions}/
        {clientPackage.totalSessions}
      </span>

      <span
        className={`status-badge package-session-${getSessionStatus()}`}
      >
        {getSessionStatusLabel()}
      </span>

      <span>€{clientPackage.amount || 0}</span>

      <span className={`status-badge ${clientPackage.paymentStatus}`}>
        {clientPackage.paymentStatus === 'paid'
          ? t('paid')
          : t('unpaid')}
      </span>

      <div className="client-row-actions">
        <button
          className="delete-icon-button"
          onClick={(event) => {
            event.stopPropagation()
            onDeletePackage(clientPackage.packageId)
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ClientPackageCard