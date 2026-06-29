import { useEffect, useState } from 'react'
import ActionPills from './common/ActionPills'
import useTranslations from '../hooks/useTranslations'

function ExerciseForm({
  onAddExercise,
  onUpdateExercise,
  selectedExercise,
  onCancel,
}) {
  const { t } = useTranslations()

  const emptyExercise = {
    exerciseName: '',
    bodyPart: 'Chest',
    equipment: '',
    defaultNotes: '',
    isFavorite: false,
  }

  const [exercise, setExercise] = useState(emptyExercise)

  useEffect(() => {
    if (selectedExercise) {
      setExercise(selectedExercise)
    } else {
      setExercise(emptyExercise)
    }
  }, [selectedExercise])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setExercise({
      ...exercise,
      [name]: type === 'checkbox'
        ? checked
        : value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (selectedExercise) {
      onUpdateExercise(exercise)
    } else {
      onAddExercise(exercise)
    }

    setExercise(emptyExercise)
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <input
        name="exerciseName"
        placeholder={t('exerciseName')}
        value={exercise.exerciseName}
        onChange={handleChange}
        required
      />

      <select
        name="bodyPart"
        value={exercise.bodyPart}
        onChange={handleChange}
      >
        <option value="Chest">
          {t('chest')}
        </option>

        <option value="Back">
          {t('back')}
        </option>

        <option value="Shoulders">
          {t('shoulders')}
        </option>

        <option value="Arms">
          {t('arms')}
        </option>

        <option value="Legs">
          {t('legs')}
        </option>

        <option value="Core">
          {t('core')}
        </option>

        <option value="Full Body">
          {t('fullBody')}
        </option>

        <option value="Cardio">
          {t('cardio')}
        </option>
      </select>

      <input
        name="equipment"
        placeholder={t('equipment')}
        value={exercise.equipment}
        onChange={handleChange}
      />

      <input
        name="defaultNotes"
        placeholder={t('defaultNotes')}
        value={exercise.defaultNotes}
        onChange={handleChange}
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="isFavorite"
          checked={exercise.isFavorite}
          onChange={handleChange}
        />

        {t('favoriteExercise')}
      </label>

      <ActionPills
  onCancel={onCancel}
  cancelLabel={t('cancel')}
  saveLabel={selectedExercise ? t('update') : t('save')}
/>
    </form>
  )
}

export default ExerciseForm