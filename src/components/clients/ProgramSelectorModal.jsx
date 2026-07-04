import SelectionModal from '../common/SelectionModal'
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
    <SelectionModal
      title={t('assignedPrograms')}
      searchPlaceholder={t('searchPrograms')}
      searchTerm={programSearchTerm}
      onSearchChange={onSearchChange}
      items={filteredPrograms}
      onClose={onClose}
      saveLabel={t('update')}
      renderItem={(program) => {
        const isSelected = assignedProgramIds.includes(program.programId)

        return (
          <div
  key={program.programId}
  data-selected={isSelected ? 'true' : 'false'}
  className="client-row clickable program-selector-row"
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
      }}
    />
  )
}

export default ProgramSelectorModal