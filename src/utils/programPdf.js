import jsPDF from 'jspdf'

export function generateProgramPdf(program) {
  const doc = new jsPDF()

  let y = 20

  doc.setFontSize(18)
  doc.text(program.programName || 'Training Program', 20, y)

  y += 10

  doc.setFontSize(11)

  if (program.goal) {
    doc.text(`Goal: ${program.goal}`, 20, y)
    y += 8
  }

  if (program.durationWeeks) {
    doc.text(`Duration: ${program.durationWeeks} weeks`, 20, y)
    y += 8
  }

  y += 6

  doc.setFontSize(14)
  doc.text('Exercises', 20, y)
  y += 10

  doc.setFontSize(10)

  program.exercises?.forEach((exercise, index) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    doc.setFont(undefined, 'bold')
    doc.text(`${index + 1}. ${exercise.exerciseName || '-'}`, 20, y)
    y += 6

    doc.setFont(undefined, 'normal')
    doc.text(`Sets: ${exercise.sets || '-'} | Reps: ${exercise.reps || '-'} | Rest: ${exercise.restSeconds || '-'}s`, 24, y)
    y += 6

    if (exercise.notes) {
      const notes = doc.splitTextToSize(`Notes: ${exercise.notes}`, 160)
      doc.text(notes, 24, y)
      y += notes.length * 5
    }

    y += 5
  })

  if (program.notes) {
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(14)
    doc.text('Program Notes', 20, y)
    y += 8

    doc.setFontSize(10)
    const notes = doc.splitTextToSize(program.notes, 170)
    doc.text(notes, 20, y)
  }

  doc.save(`${program.programName || 'training-program'}.pdf`)
}