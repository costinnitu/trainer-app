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
          <div className="form-actions pill-actions">
            <button
              type="button"
              className="add-row-button"
              onClick={onCloseSection}
            >
              {t('cancel')}
            </button>

            <button
              type="button"
              className="add-row-button"
              onClick={onOpenProgramSelector}
            >
              + {t('addProgram')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientProgramsSection