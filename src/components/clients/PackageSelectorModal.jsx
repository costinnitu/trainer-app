import ActionPills from '../common/ActionPills'
import useTranslations from '../../hooks/useTranslations'

function PackageSelectorModal({
  packageSearchTerm,
  onSearchChange,
  filteredPackages,
  onAssignPackage,
  onClose,
}) {
  const { t } = useTranslations()

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{t('packages')}</h3>

        <input
          className="search-input"
          type="text"
          placeholder={t('searchPackages')}
          value={packageSearchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <div className="client-list">
          {filteredPackages.map((packageTemplate) => (
            <div
              key={packageTemplate.packageId}
              className="client-row clickable"
              onClick={() => onAssignPackage(packageTemplate)}
            >
              <strong>{packageTemplate.packageName}</strong>

              <span>
                {packageTemplate.totalSessions} {t('sessions')}
              </span>

              <span>€{packageTemplate.amount || 0}</span>

              <span>{packageTemplate.notes || '-'}</span>
            </div>
          ))}
        </div>

        <ActionPills
          onCancel={onClose}
          cancelLabel={t('cancel')}
          saveLabel={t('update')}
          onSave={onClose}
        />
      </div>
    </div>
  )
}

export default PackageSelectorModal