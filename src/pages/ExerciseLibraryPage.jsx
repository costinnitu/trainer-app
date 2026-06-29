import { useEffect, useState } from 'react'
import AddRow from '../components/common/AddRow'
import ExerciseForm from '../components/exercises/ExerciseForm'

import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../services/exerciseService'

import useTranslations from '../hooks/useTranslations'

function ExerciseLibraryPage() {
  const { t } = useTranslations()

  const [exercises, setExercises] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadExercises()
  }, [])

  async function loadExercises() {
    try {
      setError('')

      const data = await getExercises()

      setExercises(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadExercises'))
    }
  }

  function handleShowAddForm() {
    setSelectedExercise(null)
    setShowForm(true)
  }

  function handleEditExercise(exercise) {
    setSelectedExercise(exercise)
    setShowForm(true)
  }

  function handleCancelForm() {
    setSelectedExercise(null)
    setShowForm(false)
  }

  async function handleAddExercise(newExercise) {
    try {
      setError('')

      await createExercise(newExercise)
      await loadExercises()

      handleCancelForm()
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveExercise'))
    }
  }

  async function handleUpdateExercise(updatedExercise) {
    try {
      setError('')

      await updateExercise(updatedExercise)
      await loadExercises()

      handleCancelForm()
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdateExercise'))
    }
  }

  async function handleDeleteExercise(exerciseId) {
    const confirmed = window.confirm(t('confirmDeleteExercise'))

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteExercise(exerciseId)
      await loadExercises()
    } catch (error) {
      console.error(error)
      setError(t('couldNotDeleteExercise'))
    }
  }

  async function handleToggleFavorite(exercise) {
    const updatedExercises = exercises.map((currentExercise) =>
      currentExercise.exerciseId === exercise.exerciseId
        ? {
            ...currentExercise,
            isFavorite: !currentExercise.isFavorite,
          }
        : currentExercise
    )

    setExercises(updatedExercises)

    try {
      await updateExercise({
        ...exercise,
        isFavorite: !exercise.isFavorite,
      })
    } catch (error) {
      console.error(error)

      setExercises(exercises)
      setError(t('couldNotUpdateFavorite'))
    }
  }

  function getExerciseGroups() {
    const searchValue = searchTerm.toLowerCase()

    const filteredExercises = exercises.filter((exercise) => {
      return (
        exercise.exerciseName
          ?.toLowerCase()
          .includes(searchValue) ||
        exercise.bodyPart
          ?.toLowerCase()
          .includes(searchValue) ||
        exercise.equipment
          ?.toLowerCase()
          .includes(searchValue)
      )
    })

    const favorites = filteredExercises
      .filter((exercise) => exercise.isFavorite)
      .sort((a, b) =>
        a.exerciseName.localeCompare(b.exerciseName)
      )

    const nonFavorites = filteredExercises.filter(
      (exercise) => !exercise.isFavorite
    )

    const bodyParts = [
      ...new Set(
        nonFavorites
          .map((exercise) => exercise.bodyPart)
          .filter(Boolean)
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

  const exerciseGroups = getExerciseGroups()

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('exerciseLibrary')}</h2>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder={t('searchExercises')}
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {!showForm && (
       <AddRow
  label={t('addExercise')}
  onClick={() => {
    setSelectedExercise(null)
    setShowForm(true)
  }}
/>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {showForm && (
        <ExerciseForm
          onAddExercise={handleAddExercise}
          onUpdateExercise={handleUpdateExercise}
          selectedExercise={selectedExercise}
          onCancel={handleCancelForm}
        />
      )}

      {exerciseGroups.length === 0 ? (
        <p>{t('noExercisesFound')}</p>
      ) : (
        <div className="exercise-library-list">
          {exerciseGroups.map((group) => (
            <div
              className="exercise-group"
              key={group.label}
            >
              <h3>{group.label}</h3>

              <div className="exercise-table">
                {group.exercises.map((exercise) => (
                  <div
                    className="exercise-row clickable"
                    key={exercise.exerciseId}
                    onClick={() =>
                      handleEditExercise(exercise)
                    }
                  >
                    <div>
                      <div className="exercise-name-cell">
                        <button
                          type="button"
                          className={`favorite-button ${
                            exercise.isFavorite
                              ? 'active'
                              : ''
                          }`}
                          onClick={(event) => {
                            event.stopPropagation()
                            handleToggleFavorite(exercise)
                          }}
                        >
                          ★
                        </button>

                        <strong>
                          {exercise.exerciseName}
                        </strong>
                      </div>

                      {exercise.defaultNotes && (
                        <p>{exercise.defaultNotes}</p>
                      )}
                    </div>

                    <span>{exercise.bodyPart}</span>

                    <span>
                      {exercise.equipment || '-'}
                    </span>

                    {group.label !== `★ ${t('favorites')}` ? (
                      <div className="exercise-row-actions">
                        <button
                          type="button"
                          className="delete-icon-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteExercise(
                              exercise.exerciseId
                            )
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExerciseLibraryPage