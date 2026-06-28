import { useEffect, useState } from 'react'

import { getExercises } from '../services/exerciseService'

import useTranslations from '../hooks/useTranslations'

function ProgramForm({
  onAddProgram,
  onUpdateProgram,
  selectedProgram,
  onCancel,
}) {
  const { t } = useTranslations()

  const emptyExercise = {
    exerciseId: '',
    exerciseName: '',
    bodyPart: '',
    equipment: '',
    sets: '',
    reps: '',
    restSeconds: '',
    notes: '',
  }

  const emptyProgram = {
    programName: '',
    goal: '',
    durationWeeks: '',
    notes: '',
    exercises: [emptyExercise],
  }

  const [program, setProgram] = useState(emptyProgram)
  const [exerciseLibrary, setExerciseLibrary] = useState([])

  useEffect(() => {
    loadExerciseLibrary()
  }, [])

  useEffect(() => {
    if (selectedProgram) {
      setProgram({
        ...emptyProgram,
        ...selectedProgram,
        exercises:
          selectedProgram.exercises?.length > 0
            ? selectedProgram.exercises
            : [emptyExercise],
      })
    } else {
      setProgram(emptyProgram)
    }
  }, [selectedProgram])

  async function loadExerciseLibrary() {
    try {
      const data = await getExercises()
      setExerciseLibrary(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setProgram({
      ...program,
      [name]: name === 'durationWeeks' ? Number(value) : value,
    })
  }

  function handleExerciseSelect(index, exerciseId) {
    const selectedExercise = exerciseLibrary.find(
      (exercise) => exercise.exerciseId === exerciseId
    )

    if (!selectedExercise) {
      return
    }

    const updatedExercises = [...program.exercises]

    updatedExercises[index] = {
      ...updatedExercises[index],
      exerciseId: selectedExercise.exerciseId,
      exerciseName: selectedExercise.exerciseName,
      bodyPart: selectedExercise.bodyPart,
      equipment: selectedExercise.equipment,
      notes: selectedExercise.defaultNotes || '',
    }

    setProgram({
      ...program,
      exercises: updatedExercises,
    })
  }

  function handleExerciseChange(index, field, value) {
    const updatedExercises = [...program.exercises]

    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    }

    setProgram({
      ...program,
      exercises: updatedExercises,
    })
  }

  function addExercise() {
    setProgram({
      ...program,
      exercises: [...program.exercises, emptyExercise],
    })
  }

  function removeExercise(index) {
    const updatedExercises = program.exercises.filter(
      (_, exerciseIndex) => exerciseIndex !== index
    )

    setProgram({
      ...program,
      exercises:
        updatedExercises.length > 0
          ? updatedExercises
          : [emptyExercise],
    })
  }

  function getGroupedExerciseOptions() {
    const favorites = exerciseLibrary
      .filter((exercise) => exercise.isFavorite)
      .sort((a, b) =>
        a.exerciseName.localeCompare(b.exerciseName)
      )

    const nonFavorites = exerciseLibrary.filter(
      (exercise) => !exercise.isFavorite
    )

    const bodyParts = [
      ...new Set(
        nonFavorites.map((exercise) => exercise.bodyPart)
      ),
    ].sort()

    const groups = []

    if (favorites.length > 0) {
      groups.push({
        label: `★ ${t('favorites')}`,
        exercises: favorites,
      })
    }

    bodyParts.forEach((bodyPart) => {
      const exercisesForBodyPart = nonFavorites
        .filter((exercise) => exercise.bodyPart === bodyPart)
        .sort((a, b) =>
          a.exerciseName.localeCompare(b.exerciseName)
        )

      groups.push({
        label: bodyPart,
        exercises: exercisesForBodyPart,
      })
    })

    return groups
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (selectedProgram) {
      onUpdateProgram(program)
    } else {
      onAddProgram(program)
    }

    setProgram(emptyProgram)
  }

  return (
    <form className="program-editor" onSubmit={handleSubmit}>
      <section className="profile-summary">
        <h2 className="program-editor-title">
          {program.programName || '...'}
        </h2>

        <div className="program-details-row program-details-header">
          <strong>{t('programName')}</strong>
          <strong>{t('goal')}</strong>
          <strong>{t('weeks')}</strong>
        </div>

        <div className="program-details-row">
          <input
            name="programName"
            value={program.programName}
            onChange={handleChange}
            required
          />

          <input
            name="goal"
            value={program.goal}
            onChange={handleChange}
          />

          <input
            type="number"
            name="durationWeeks"
            value={program.durationWeeks}
            onChange={handleChange}
            min="1"
          />
        </div>
      </section>

      <section className="profile-summary">
        <h3>{t('exercises')}</h3>

        <div className="program-exercise-list">
          <div className="program-exercise-row program-exercise-row-header">
            <strong>{t('exercise')}</strong>
            <strong>{t('sets')}</strong>
            <strong>{t('reps')}</strong>
            <strong>{t('rest')}</strong>
            <strong>{t('notes')}</strong>
            <div></div>
          </div>

          {program.exercises.map((exercise, index) => (
            <div className="program-exercise-row" key={index}>
              <select
                value={exercise.exerciseId}
                onChange={(event) =>
                  handleExerciseSelect(index, event.target.value)
                }
                required
              >
                <option value="">{t('selectExercise')}</option>

                {getGroupedExerciseOptions().map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.exercises.map((libraryExercise) => (
                      <option
                        key={libraryExercise.exerciseId}
                        value={libraryExercise.exerciseId}
                      >
                        {libraryExercise.isFavorite ? '★ ' : ''}
                        {libraryExercise.exerciseName}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <input
                value={exercise.sets}
                onChange={(event) =>
                  handleExerciseChange(index, 'sets', event.target.value)
                }
              />

              <input
                value={exercise.reps}
                onChange={(event) =>
                  handleExerciseChange(index, 'reps', event.target.value)
                }
              />

              <input
                value={exercise.restSeconds}
                onChange={(event) =>
                  handleExerciseChange(index, 'restSeconds', event.target.value)
                }
              />

              <input
                value={exercise.notes}
                onChange={(event) =>
                  handleExerciseChange(index, 'notes', event.target.value)
                }
              />

              <button
                type="button"
                className="delete-icon-button"
                onClick={() => removeExercise(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="add-row">
  <button
    type="button"
    className="add-row-button"
    onClick={addExercise}
  >
    + {t('addExercise')}
  </button>
</div>
      </section>

      <section className="profile-summary">
        <h3>{t('notes')}</h3>

        <div className="exercise-input-group">
          <label>{t('programNotes')}</label>

          <textarea
            name="notes"
            className="program-notes-textarea"
            value={program.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>
      </section>

      <div className="form-actions pill-actions">
  <button
    type="button"
    className="add-row-button"
    onClick={onCancel}
  >
    {t('cancel')}
  </button>

  <button
    type="submit"
    className="add-row-button"
  >
    {selectedProgram ? t('update') : t('save')}
  </button>
</div>
    </form>
  )
}

export default ProgramForm