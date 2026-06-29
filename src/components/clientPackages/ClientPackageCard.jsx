import useTranslations from '../../hooks/useTranslations'

function ClientPackageCard({
  clientPackage,
  onEditPackage,
  onDeletePackage,
  onTogglePaymentStatus,
}) {
  const { t } = useTranslations()

  function getSessionStatus() {
    const remaining = Number(clientPackage.remainingSessions || 0)

    if (remaining === 0) return 'exhausted'
    if (remaining === 1) return 'last'
    if (remaining <= 3) return 'low'

    return 'healthy'
  }

  function getSessionStatusLabel() {
    const remaining = Number(clientPackage.remainingSessions || 0)

    if (remaining === 0) return t('exhausted')
    if (remaining === 1) return t('lastSession')
    if (remaining <= 3) return t('lowSessions')

    return t('healthy')
  }

  return (
    <div
      className="package-list-row clickable"
      onClick={() => onEditPackage(clientPackage)}
    >
      <strong>{clientPackage.clientName}</strong>

      <span>{clientPackage.packageName}</span>

      <span>
        {clientPackage.remainingSessions}/
        {clientPackage.totalSessions}
      </span>

      <div className="package-cell">
  <span className={`status-badge package-session-${getSessionStatus()}`}>
    {getSessionStatusLabel()}
  </span>
</div>

      <span>€{clientPackage.amount || 0}</span>

      <div className="package-cell">
  <button
    type="button"
    className={`payment-status-toggle ${
      clientPackage.paymentStatus || 'unpaid'
    }`}
    onClick={(event) => {
      event.stopPropagation()
      onTogglePaymentStatus(clientPackage)
    }}
  >
    <span>
      {clientPackage.paymentStatus === 'paid'
        ? t('paid')
        : t('unpaid')}
    </span>
  </button>
</div>
      <div className="client-row-actions">    
        <button
          type="button"
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