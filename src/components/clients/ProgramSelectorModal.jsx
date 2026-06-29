import ActionPills from '../common/ActionPills'
import useTranslations from '../../hooks/useTranslations'

function ProgramSelectorModal({
  programSearchTerm,
  onSearchChange,
  filteredPrograms,
  assignedProgramIds,
  onToggleProgram,
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
        <h3>{t('assignedPrograms')}</h3>

        <input
          className="search-input"
          type="text"
          placeholder={t('searchPrograms')}
          value={programSearchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <div className="client-list">
          {filteredPrograms.map((program) => {
            const isSelected = assignedProgramIds.includes(program.programId)

            return (
              <div
                key={program.programId}
                className="client-row clickable"
                onClick={() => onToggleProgram(program.programId)}
              >
                <strong>{program.programName}</strong>
                <span>{program.goal || '-'}</span>
                <span>
                  {program.durationWeeks
                    ? `${program.durationWeeks} ${t('weeks')}`
                    : '-'}
                </span>
                <span
                  className={`status-badge ${
                    isSelected ? 'paid' : 'inactive'
                  }`}
                >
                  {isSelected ? t('active') : t('inactive')}
                </span>
              </div>
            )
          })}
        </div>

        <ActionPills
          onCancel={onClose}
          onSave={onClose}
          cancelLabel={t('cancel')}
          saveLabel={t('update')}
        />
      </div>
    </div>
  )
}

export default ProgramSelectorModal