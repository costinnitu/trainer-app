import SelectionModal from '../common/SelectionModal'
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
    <SelectionModal
      title={t('packages')}
      searchPlaceholder={t('searchPackages')}
      searchTerm={packageSearchTerm}
      onSearchChange={onSearchChange}
      items={filteredPackages}
      onClose={onClose}
      saveLabel={t('update')}
      renderItem={(packageTemplate) => (
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
      )}
    />
  )
}

export default PackageSelectorModal