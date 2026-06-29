import AddRow from '../common/AddRow'
import ActionPills from '../common/ActionPills'
import useTranslations from '../../hooks/useTranslations'

function ClientProgramsSection({
  activeSection,
  toggleSection,
  selectedProgramNames,
  onCloseSection,
  onOpenProgramSelector,
}) {
  const { t } = useTranslations()

  return (
    <div
      className="profile-summary clickable-summary"
      onClick={() => toggleSection('programs')}
    >
      <div className="section-header clickable-section-header">
        <h4>{t('assignedPrograms')}</h4>
      </div>

      <p>{selectedProgramNames || t('noProgramsYet')}</p>

      {activeSection === 'programs' && (
        <div
          className="section-content"
          onClick={(event) => event.stopPropagation()}
        >
          <ActionPills
            onCancel={onCloseSection}
            onSave={onOpenProgramSelector}
            cancelLabel={t('cancel')}
            saveLabel={t('addProgram')}
          />
        </div>
      )}
    </div>
  )
}

export default ClientProgramsSection