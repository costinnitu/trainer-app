import AddRow from '../common/AddRow'
import useTranslations from '../../hooks/useTranslations'

function ClientPackagesSection({
  clientPackages,
  getPackagePaymentStatus,
  onUpdatePackage,
  onDeletePackage,
  onOpenPackageSelector,
}) {
  const { t } = useTranslations()

  return (
    <div className="profile-summary clickable-summary">
      <div className="section-header clickable-section-header">
        <h4>{t('packages')}</h4>
      </div>

      <div
        className="section-content"
        onClick={(event) => event.stopPropagation()}
      >
        {clientPackages.length === 0 ? (
          <p>{t('noPackagesYet')}</p>
        ) : (
          <div className="client-package-list">
            <div className="client-package-row client-package-row-header">
              <strong>{t('package')}</strong>
              <strong>{t('sessions')}</strong>
              <strong>{t('amount')}</strong>
              <strong>{t('status')}</strong>
              <div></div>
            </div>

            {clientPackages.map((clientPackage) => {
              const paymentStatus = getPackagePaymentStatus(
                clientPackage.packageId
              )

              return (
                <div
                  className="client-package-row"
                  key={clientPackage.packageId}
                >
                  <strong>{clientPackage.packageName}</strong>

                  <span>
                    {clientPackage.remainingSessions}/
                    {clientPackage.totalSessions}
                  </span>

                  <span>€{clientPackage.amount || 0}</span>

                  <button
                    type="button"
                    className={`payment-status-toggle ${paymentStatus}`}
                    onClick={(event) => {
                      event.stopPropagation()

                      onUpdatePackage({
                        ...clientPackage,
                        paymentStatus:
                          paymentStatus === 'paid' ? 'unpaid' : 'paid',
                      })
                    }}
                  >
                    <span>
                      {paymentStatus === 'paid'
                        ? t('paid')
                        : t('unpaid')}
                    </span>
                  </button>

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
              )
            })}
          </div>
        )}

        <AddRow
          label={t('addPackage')}
          onClick={onOpenPackageSelector}
        />
      </div>
    </div>
  )
}

export default ClientPackagesSection