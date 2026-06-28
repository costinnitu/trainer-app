import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProgramCard from '../components/ProgramCard'
import ProgramForm from '../components/ProgramForm'

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../services/programService'

import useTranslations from '../hooks/useTranslations'

function ProgramsPage() {
  const { t } = useTranslations()

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

      const programsData = await getPrograms()

      setPrograms(Array.isArray(programsData) ? programsData : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadPrograms'))
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
      setError(t('couldNotSaveProgram'))
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
      setError(t('couldNotUpdateProgram'))
    }
  }

  async function handleDeleteProgram(programId) {
    const confirmed = window.confirm(t('confirmDeleteProgram'))

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteProgram(programId)
      await loadPrograms()
    } catch (error) {
      console.error(error)
      setError(t('couldNotDeleteProgram'))
    }
  }

  function handleCancelForm() {
    setSelectedProgram(null)
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('trainingPrograms')}</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <ProgramForm
          selectedProgram={selectedProgram}
          onAddProgram={handleAddProgram}
          onUpdateProgram={handleUpdateProgram}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <div className="client-grid">
          {programs.map((program) => (
            <ProgramCard
              key={program.programId}
              program={program}
              onEditProgram={handleEditProgram}
              onDeleteProgram={handleDeleteProgram}
            />
          ))}

          <div
            className="add-program-card"
            onClick={() => setShowForm(true)}
          >
            <Plus
              size={32}
              strokeWidth={2}
              className="add-program-icon"
            />

            <span className="label">
              {t('addProgram')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgramsPage