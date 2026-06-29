import useTranslations from '../../hooks/useTranslations'
import { generateProgramPdf } from '../../utils/programPdf'

function ProgramCard({
  program,
  onEditProgram,
  onDeleteProgram,
}) {
  const { t } = useTranslations()

  return (
    <div
  className="client-card program-card clickable-program-card"
  onClick={() => onEditProgram(program)}
>
  <button
    type="button"
    className="delete-icon-button program-delete-button"
    onClick={(event) => {
      event.stopPropagation()
      onDeleteProgram(program.programId)
    }}
  >
    ×
  </button>

  <div className="program-card-content">
    <h3>{program.programName}</h3>

    {program.goal && (
      <p>
        <strong>{t('goal')}:</strong> {program.goal}
      </p>
    )}

    {program.durationWeeks && (
      <p>
        <strong>{t('duration')}:</strong>{' '}
        {program.durationWeeks} {t('weeks')}
      </p>
    )}

    <p>
  <strong>{t('exercises')}</strong>
</p>

<p className="program-summary">
  🏋 {program.exercises?.length || 0} {t('exercises')}
</p>


<p className="program-card-hint">
   {t('clickToView')}
</p>
  </div>

  <div className="program-card-actions">
    <button
      type="button"
      className="add-row-button"
      onClick={(event) => {
        event.stopPropagation()
        generateProgramPdf(program)
      }}
    >
      PDF
    </button>
  </div>
</div>
  )
}

export default ProgramCard