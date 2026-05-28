import { useEffect, useState } from 'react'

function ExerciseForm({
  onAddExercise,
  onUpdateExercise,
  selectedExercise,
}) {
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
      [name]: type === 'checkbox' ? checked : value,
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
        placeholder="Exercise name"
        value={exercise.exerciseName}
        onChange={handleChange}
        required
      />

      <select
        name="bodyPart"
        value={exercise.bodyPart}
        onChange={handleChange}
      >
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Arms">Arms</option>
        <option value="Legs">Legs</option>
        <option value="Core">Core</option>
        <option value="Full Body">Full Body</option>
        <option value="Cardio">Cardio</option>
      </select>

      <input
        name="equipment"
        placeholder="Equipment"
        value={exercise.equipment}
        onChange={handleChange}
      />

      <input
        name="defaultNotes"
        placeholder="Default notes"
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
        Favorite exercise
      </label>

      <button type="submit">
        {selectedExercise ? 'Update Exercise' : 'Save Exercise'}
      </button>
    </form>
  )
}

export default ExerciseForm