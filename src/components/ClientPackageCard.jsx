import useTranslations from '../hooks/useTranslations'

function ClientPackageCard({
  clientPackage,
  onEditPackage,
  onDeletePackage,
}) {
  const { t } = useTranslations()

  return (
    <div
      className="client-row clickable"
      onClick={() =>
        onEditPackage(clientPackage)
      }
    >
      <strong>
        {clientPackage.clientName}
      </strong>

      <span>
        {clientPackage.packageName}
      </span>

      <span>
        {clientPackage.remainingSessions}/
        {clientPackage.totalSessions}
      </span>

      <span>
        €{clientPackage.amount || 0}
      </span>

      <span
        className={`status-badge ${clientPackage.paymentStatus}`}
      >
        {clientPackage.paymentStatus === 'paid'
          ? t('paid')
          : t('unpaid')}
      </span>

      <div className="client-row-actions">
        <button
          className="delete-icon-button"
          onClick={(event) => {
            event.stopPropagation()

            onDeletePackage(
              clientPackage.packageId
            )
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ClientPackageCard