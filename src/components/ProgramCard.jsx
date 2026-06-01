import useTranslations from '../hooks/useTranslations'

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
        className="delete-icon-button program-delete-button"
        onClick={(event) => {
          event.stopPropagation()

          onDeleteProgram(program.programId)
        }}
      >
        ×
      </button>

      <h3>{program.programName}</h3>

      {program.goal && (
        <p>
          <strong>{t('goal')}:</strong>{' '}
          {program.goal}
        </p>
      )}

      {program.durationWeeks > 0 && (
        <p>
          <strong>{t('duration')}:</strong>{' '}
          {program.durationWeeks}{' '}
          {t('weeks')}
        </p>
      )}

      <div>
        <strong>{t('exercises')}:</strong>

        {program.exercises?.length > 0 ? (
          <ul className="exercise-list">
            {program.exercises.map(
              (exercise, index) => (
                <li key={index}>
                  {exercise.exerciseName}

                  {exercise.sets &&
                    ` — ${exercise.sets} ${t('sets').toLowerCase()}`}

                  {exercise.reps &&
                    ` × ${exercise.reps} ${t('reps').toLowerCase()}`}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>{t('noExercisesAdded')}</p>
        )}
      </div>

      {program.notes && (
        <p>
          <strong>{t('notes')}:</strong>{' '}
          {program.notes}
        </p>
      )}
    </div>
  )
}

export default ProgramCard