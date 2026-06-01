import useTranslations from '../hooks/useTranslations'

function ExerciseCard({
  exercise,
  onEditExercise,
  onDeleteExercise,
}) {
  const { t } = useTranslations()

  return (
    <div className="client-card">
      <h3>
        {exercise.isFavorite ? '★ ' : ''}
        {exercise.exerciseName}
      </h3>

      <p>
        <strong>
          {t('bodyPart')}:
        </strong>{' '}
        {exercise.bodyPart}
      </p>

      {exercise.equipment && (
        <p>
          <strong>
            {t('equipment')}:
          </strong>{' '}
          {exercise.equipment}
        </p>
      )}

      {exercise.defaultNotes && (
        <p>
          <strong>
            {t('notes')}:
          </strong>{' '}
          {exercise.defaultNotes}
        </p>
      )}

      <div className="card-actions">
        <button
          onClick={() =>
            onEditExercise(exercise)
          }
        >
          {t('edit')}
        </button>

        <button
          className="danger-button"
          onClick={() =>
            onDeleteExercise(
              exercise.exerciseId
            )
          }
        >
          {t('delete')}
        </button>
      </div>
    </div>
  )
}

export default ExerciseCard