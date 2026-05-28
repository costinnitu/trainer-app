import { useEffect, useState } from 'react'

import ProgramCard from '../components/ProgramCard'
import ProgramForm from '../components/ProgramForm'

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../services/programService'

function ProgramsPage() {
  const [programs, setPrograms] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPrograms()
  }, [])

  async function loadPrograms() {
    try {
      setError('')

      const data = await getPrograms()
      setPrograms(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setError('Could not load programs')
    }
  }

  async function handleAddProgram(newProgram) {
    try {
      setError('')

      await createProgram(newProgram)
      await loadPrograms()
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError('Could not save program')
    }
  }

  function handleEditProgram(program) {
    setSelectedProgram(program)
    setShowForm(true)
  }

  async function handleUpdateProgram(updatedProgram) {
    try {
      setError('')

      await updateProgram(updatedProgram)
      await loadPrograms()
      setSelectedProgram(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError('Could not update program')
    }
  }

  async function handleDeleteProgram(programId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this program?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteProgram(programId)
      await loadPrograms()
    } catch (error) {
      console.error(error)
      setError('Could not delete program')
    }
  }

  function handleCancelForm() {
    setSelectedProgram(null)
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Training Programs</h2>

        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Program'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <ProgramForm
          onAddProgram={handleAddProgram}
          onUpdateProgram={handleUpdateProgram}
          selectedProgram={selectedProgram}
        />
      )}

      {programs.length === 0 ? (
        <p>No programs yet.</p>
      ) : (
        <div className="client-grid">
          {programs.map((program) => (
            <ProgramCard
              key={program.programId}
              program={program}
              onEditProgram={handleEditProgram}
              onDeleteProgram={handleDeleteProgram}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProgramsPage