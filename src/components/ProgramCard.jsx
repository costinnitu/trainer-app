function ProgramCard({ program, onEditProgram, onDeleteProgram }) {
  return (
    <div className="client-card">
      <h3>{program.programName}</h3>

      <p>
        <strong>Goal:</strong> {program.goal}
      </p>

      <p>
        <strong>Duration:</strong> {program.durationWeeks} weeks
      </p>

      <div>
        <strong>Exercises:</strong>
        
  {program.exercises?.length > 0 ? (
    <ul className="exercise-list">
      {program.exercises.map((exercise, index) => (
        <li key={index}>
          {exercise.exerciseName} — {exercise.sets} sets × {exercise.reps} reps
        </li>
      ))}
    </ul>
  ) : (
    <p>No exercises added.</p>
  )}
</div>

      <p>
        <strong>Notes:</strong> {program.notes}
      </p>

      <div className="card-actions">
        <button onClick={() => onEditProgram(program)}>
          Edit
        </button>

        <button
          className="danger-button"
          onClick={() => onDeleteProgram(program.programId)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ProgramCard