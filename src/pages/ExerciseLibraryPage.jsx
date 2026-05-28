import { useEffect, useState } from 'react'

import ExerciseForm from '../components/ExerciseForm'
import starterExercises from '../data/starterExercises'

import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../services/exerciseService'

function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [error, setError] = useState('')

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
      setError('Could not load exercises')
    }
  }

  async function handleSeedExercises() {
    try {
      setError('')

      const existingExerciseNames = exercises.map((exercise) =>
        exercise.exerciseName.toLowerCase()
      )

      const exercisesToCreate = starterExercises.filter(
        (exercise) =>
          !existingExerciseNames.includes(exercise.exerciseName.toLowerCase())
      )

      if (exercisesToCreate.length === 0) {
        alert('Starter exercises already exist.')
        return
      }

      for (const exercise of exercisesToCreate) {
        await createExercise(exercise)
      }

      await loadExercises()
    } catch (error) {
      console.error(error)
      setError('Could not seed exercises')
    }
  }

  async function handleAddExercise(newExercise) {
    try {
      setError('')

      await createExercise(newExercise)
      await loadExercises()
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError('Could not save exercise')
    }
  }

  function handleEditExercise(exercise) {
    setSelectedExercise(exercise)
    setShowForm(true)
  }

  async function handleUpdateExercise(updatedExercise) {
    try {
      setError('')

      await updateExercise(updatedExercise)
      await loadExercises()
      setSelectedExercise(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError('Could not update exercise')
    }
  }

  async function handleDeleteExercise(exerciseId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this exercise?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteExercise(exerciseId)
      await loadExercises()
    } catch (error) {
      console.error(error)
      setError('Could not delete exercise')
    }
  }

  function handleCancelForm() {
    setSelectedExercise(null)
    setShowForm(false)
  }

  function getExerciseGroups() {
    const favorites = exercises
      .filter((exercise) => exercise.isFavorite)
      .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))

    const nonFavorites = exercises.filter((exercise) => !exercise.isFavorite)

    const bodyParts = [
      ...new Set(nonFavorites.map((exercise) => exercise.bodyPart)),
    ].sort()

    const groups = []

    if (favorites.length > 0) {
      groups.push({
        label: '★ Favorites',
        exercises: favorites,
      })
    }

    bodyParts.forEach((bodyPart) => {
      const exercisesForBodyPart = nonFavorites
        .filter((exercise) => exercise.bodyPart === bodyPart)
        .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))

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
        <h2>Exercise Library</h2>

        <div className="card-actions">
          <button onClick={handleSeedExercises}>
            Seed Starter Exercises
          </button>

          <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
            {showForm ? 'Cancel' : 'Add Exercise'}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <ExerciseForm
          onAddExercise={handleAddExercise}
          onUpdateExercise={handleUpdateExercise}
          selectedExercise={selectedExercise}
        />
      )}

      {exerciseGroups.length === 0 ? (
        <p>No exercises yet.</p>
      ) : (
        <div className="exercise-library-list">
          {exerciseGroups.map((group) => (
            <div className="exercise-group" key={group.label}>
              <h3>{group.label}</h3>

              <div className="exercise-table">
                {group.exercises.map((exercise) => (
                  <div className="exercise-row" key={exercise.exerciseId}>
                    <div>
                      <strong>
                        {exercise.isFavorite ? '★ ' : ''}
                        {exercise.exerciseName}
                      </strong>

                      {exercise.defaultNotes && (
                        <p>{exercise.defaultNotes}</p>
                      )}
                    </div>

                    <span>{exercise.bodyPart}</span>

                    <span>{exercise.equipment || '-'}</span>

                    <div className="exercise-row-actions">
                      <button onClick={() => handleEditExercise(exercise)}>
                        Edit
                      </button>

                      <button
                        className="danger-button"
                        onClick={() =>
                          handleDeleteExercise(exercise.exerciseId)
                        }
                      >
                        Delete
                      </button>
                    </div>
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