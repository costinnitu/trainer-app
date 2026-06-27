import { useEffect, useState } from 'react'

import { getExercises } from '../services/exerciseService'

import useTranslations from '../hooks/useTranslations'

function ProgramForm({
  onAddProgram,
  onUpdateProgram,
  selectedProgram,
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
  const [activeSection, setActiveSection] = useState(null)

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

    setActiveSection(null)
  }, [selectedProgram])

  async function loadExerciseLibrary() {
    try {
      const data = await getExercises()

      setExerciseLibrary(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  function toggleSection(sectionName) {
    setActiveSection(
      activeSection === sectionName ? null : sectionName
    )
  }

  function handleChange(event) {
    const { name, value } = event.target

    setProgram({
      ...program,
      [name]:
        name === 'durationWeeks'
          ? Number(value)
          : value,
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
      exercises: [
        ...program.exercises,
        emptyExercise,
      ],
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

  function getExerciseSummary() {
    const exerciseCount = program.exercises.filter(
      (exercise) => exercise.exerciseName
    ).length

    if (exerciseCount === 0) {
      return t('noExercisesAdded')
    }

    return `${exerciseCount} ${t('exercises')}`
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
      <div
        className="profile-summary clickable-summary"
        onClick={() => toggleSection('details')}
      >
        <h4>{t('programDetails') || t('program')}</h4>

        <p>
          <strong>{t('programName')}:</strong>{' '}
          {program.programName || '-'}
        </p>

        {program.goal && (
          <p>
            <strong>{t('goal')}:</strong> {program.goal}
          </p>
        )}

        {program.durationWeeks > 0 && (
          <p>
            <strong>{t('duration')}:</strong>{' '}
            {program.durationWeeks} {t('weeks')}
          </p>
        )}

        {activeSection === 'details' && (
          <div
            className="section-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="client-form">
              <div className="exercise-input-group">
                <label>{t('programName')}</label>

                <input
                  name="programName"
                  value={program.programName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="exercise-input-group">
                <label>{t('goal')}</label>

                <input
                  name="goal"
                  value={program.goal}
                  onChange={handleChange}
                />
              </div>

              <div className="exercise-input-group">
                <label>{t('durationWeeks')}</label>

                <input
                  type="number"
                  name="durationWeeks"
                  value={program.durationWeeks}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="profile-summary clickable-summary"
        onClick={() => toggleSection('exercises')}
      >
        <h4>{t('exercises')}</h4>

        <p>{getExerciseSummary()}</p>

        {activeSection === 'exercises' && (
          <div
            className="section-content"
            onClick={(event) => event.stopPropagation()}
          >
            {program.exercises.map((exercise, index) => (
              <div
                className="exercise-form-card"
                key={index}
              >
                <div className="exercise-form-grid">
                  <div className="exercise-input-group">
                    <label>{t('exercise')}</label>

                    <select
                      value={exercise.exerciseId}
                      onChange={(event) =>
                        handleExerciseSelect(index, event.target.value)
                      }
                      required
                    >
                      <option value="">
                        {t('selectExercise')}
                      </option>

                      {getGroupedExerciseOptions().map((group) => (
                        <optgroup
                          key={group.label}
                          label={group.label}
                        >
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
                  </div>

                  <div className="exercise-input-group">
                    <label>{t('sets')}</label>

                    <input
                      value={exercise.sets}
                      onChange={(event) =>
                        handleExerciseChange(
                          index,
                          'sets',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="exercise-input-group">
                    <label>{t('reps')}</label>

                    <input
                      value={exercise.reps}
                      onChange={(event) =>
                        handleExerciseChange(
                          index,
                          'reps',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="exercise-input-group">
                    <label>{t('rest')}</label>

                    <input
                      value={exercise.restSeconds}
                      onChange={(event) =>
                        handleExerciseChange(
                          index,
                          'restSeconds',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="exercise-delete-cell">
                    {program.exercises.length > 1 && (
                      <button
                        type="button"
                        className="delete-icon-button"
                        onClick={() => removeExercise(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="exercise-input-group exercise-form-notes">
                    <label>{t('notes')}</label>

                    <input
                      value={exercise.notes}
                      onChange={(event) =>
                        handleExerciseChange(
                          index,
                          'notes',
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <div
              className="add-package-row"
              onClick={addExercise}
            >
              <span className="add-package-icon">+</span>
              <span>{t('addExercise')}</span>
            </div>
          </div>
        )}
      </div>

      <div
        className="profile-summary clickable-summary"
        onClick={() => toggleSection('notes')}
      >
        <h4>{t('notes')}</h4>

        <p>{program.notes || '-'}</p>

        {activeSection === 'notes' && (
          <div
            className="section-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="client-form">
              <div className="exercise-input-group">
                <label>{t('programNotes')}</label>

                <input
                  name="notes"
                  value={program.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit">
          {selectedProgram ? t('updateProgram') : t('saveProgram')}
        </button>
      </div>
    </form>
  )
}

export default ProgramForm