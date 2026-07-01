import { useEffect, useState } from 'react'

import AddRow from '../components/common/AddRow'
import SearchBar from '../components/common/SearchBar'
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
    const previousExercises = exercises

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

      setExercises(previousExercises)
      setError(t('couldNotUpdateFavorite'))
    }
  }

  function getFilteredExercises() {
    const searchValue = searchTerm.toLowerCase()

    return exercises
      .filter((exercise) => {
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
      .sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) {
          return -1
        }

        if (!a.isFavorite && b.isFavorite) {
          return 1
        }

        return a.exerciseName.localeCompare(b.exerciseName)
      })
  }

  const filteredExercises = getFilteredExercises()

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('exerciseLibrary')}</h2>
      </div>

      <SearchBar
        placeholder={t('searchExercises')}
        value={searchTerm}
        onChange={setSearchTerm}
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

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <ExerciseForm
          onAddExercise={handleAddExercise}
          onUpdateExercise={handleUpdateExercise}
          selectedExercise={selectedExercise}
          onCancel={handleCancelForm}
        />
      )}

      {filteredExercises.length === 0 ? (
        <p>{t('noExercisesFound')}</p>
      ) : (
        <div className="exercise-table">
          <div className="exercise-row exercise-row-header">
            <div></div>
            <strong>{t('exercise')}</strong>
            <strong>{t('bodyPart')}</strong>
            <strong>{t('equipment')}</strong>
            <div></div>
          </div>

          {filteredExercises.map((exercise) => (
            <div
              className="exercise-row clickable"
              key={exercise.exerciseId}
              onClick={() => {
                setSelectedExercise(exercise)
                setShowForm(true)
              }}
            >
              <button
                type="button"
                className={`favorite-button ${
                  exercise.isFavorite ? 'active' : ''
                }`}
                onClick={(event) => {
                  event.stopPropagation()
                  handleToggleFavorite(exercise)
                }}
              >
                ★
              </button>

              <div>
                <strong>{exercise.exerciseName}</strong>

                {exercise.defaultNotes && (
                  <p>{exercise.defaultNotes}</p>
                )}
              </div>

              <span>{exercise.bodyPart}</span>

              <span>{exercise.equipment || '-'}</span>

              <div className="exercise-row-actions">
                <button
                  type="button"
                  className="delete-icon-button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDeleteExercise(exercise.exerciseId)
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExerciseLibraryPage