function ProgramCard({ program, onEditProgram, onDeleteProgram }) {
  return (
<div
  className="client-card program-card clickable-program-card"
  onClick={() => onEditProgram(program)}
>      <button
  className="delete-icon-button program-delete-button"
onClick={(event) => {
  event.stopPropagation()
  onDeleteProgram(program.programId)
}}>
  ×
</button>
      <h3>{program.programName}</h3>

      {program.goal && (
  <p>
    <strong>Goal:</strong> {program.goal}
  </p>
)}

      <p>
        <strong>Duration:</strong> {program.durationWeeks} weeks
      </p>

      <div>
        <strong>Exercises:</strong>
        
  {program.exercises?.length > 0 ? (
    <ul className="exercise-list">
      {program.exercises.map((exercise, index) => (
        <li key={index}>
  {exercise.exerciseName}

  {exercise.sets && ` — ${exercise.sets} sets`}
  {exercise.reps && ` × ${exercise.reps} reps`}
</li>
      ))}
    </ul>
  ) : (
    <p>No exercises added.</p>
  )}
</div>

     {program.notes && (
  <p>
    <strong>Notes:</strong> {program.notes}
  </p>
)}

      <div className="card-actions">

      </div>
    </div>
  )
}

export default ProgramCard