import useTranslations from '../../hooks/useTranslations'

function PackageCard({
  packageTemplate,
  onEditPackage,
  onDeletePackage,
}) {
  const { t } = useTranslations()

  return (
    <div
      className="client-card program-card clickable-program-card"
      onClick={() => onEditPackage(packageTemplate)}
    >
      <button
        type="button"
        className="delete-icon-button program-delete-button"
        onClick={(event) => {
          event.stopPropagation()
          onDeletePackage(packageTemplate.packageId)
        }}
      >
        ×
      </button>

      <div className="program-card-content">
        <h3>{packageTemplate.packageName}</h3>

        <p>
          <strong>{t('sessions')}</strong>
        </p>

        <p className="program-summary">
          {packageTemplate.totalSessions}
        </p>

        <p>
          <strong>{t('amount')}</strong>
        </p>

        <p className="program-summary">
          €{packageTemplate.amount || 0}
        </p>

        {packageTemplate.notes && (
          <>
            <p>
              <strong>{t('notes')}</strong>
            </p>

            <p className="program-summary">
              {packageTemplate.notes}
            </p>
          </>
        )}

        <p className="program-card-hint">
          {t('clickToView')}
        </p>
      </div>
    </div>
  )
}

export default PackageCard