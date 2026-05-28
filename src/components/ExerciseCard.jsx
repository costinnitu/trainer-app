function ExerciseCard({ exercise, onEditExercise, onDeleteExercise }) {
  return (
    <div className="client-card">
      <h3>
        {exercise.isFavorite ? '★ ' : ''}
        {exercise.exerciseName}
      </h3>

      <p>
        <strong>Body part:</strong> {exercise.bodyPart}
      </p>

      <p>
        <strong>Equipment:</strong> {exercise.equipment}
      </p>

      <p>
        <strong>Notes:</strong> {exercise.defaultNotes}
      </p>

      <div className="card-actions">
        <button onClick={() => onEditExercise(exercise)}>
          Edit
        </button>

        <button
          className="danger-button"
          onClick={() => onDeleteExercise(exercise.exerciseId)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ExerciseCard