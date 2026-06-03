import { useEffect, useState } from 'react'

import ProgramCard from '../components/ProgramCard'
import ProgramForm from '../components/ProgramForm'

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../services/programService'

import { getClients } from '../services/clientService'

import {
  getClientPrograms,
  assignProgramToClient,
  removeProgramAssignment,
} from '../services/clientProgramService'

import useTranslations from '../hooks/useTranslations'

function ProgramsPage() {
  const { t } = useTranslations()

  const [programs, setPrograms] = useState([])
  const [clients, setClients] = useState([])
  const [clientPrograms, setClientPrograms] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPrograms()
  }, [])

  async function loadPrograms() {
    try {
      setError('')

      const [programsData, clientsData, assignmentsData] =
        await Promise.all([
          getPrograms(),
          getClients(),
          getClientPrograms(),
        ])

      setPrograms(Array.isArray(programsData) ? programsData : [])
      setClients(Array.isArray(clientsData) ? clientsData : [])
      setClientPrograms(
        Array.isArray(assignmentsData) ? assignmentsData : []
      )
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadPrograms'))
    }
  }

  function getAssignedClientIds(programId) {
    return clientPrograms
      .filter((assignment) => assignment.programId === programId)
      .map((assignment) => assignment.clientId)
  }

  function getAssignedClients(programId) {
    const assignedClientIds = getAssignedClientIds(programId)

    return clients.filter((client) =>
      assignedClientIds.includes(client.clientId)
    )
  }

  async function syncClientAssignments(programId, selectedClientIds) {
    const existingAssignments = clientPrograms.filter(
      (assignment) => assignment.programId === programId
    )

    const existingClientIds = existingAssignments.map(
      (assignment) => assignment.clientId
    )

    const clientsToAdd = selectedClientIds.filter(
      (clientId) => !existingClientIds.includes(clientId)
    )

    const assignmentsToRemove = existingAssignments.filter(
      (assignment) => !selectedClientIds.includes(assignment.clientId)
    )

    for (const clientId of clientsToAdd) {
      await assignProgramToClient({
        clientId,
        programId,
      })
    }

    for (const assignment of assignmentsToRemove) {
      await removeProgramAssignment(assignment.assignmentId)
    }
  }

  async function handleAddProgram(newProgram) {
    try {
      setError('')

      const { assignedClientIds, ...programData } = newProgram

      const savedProgram = await createProgram(programData)

      await syncClientAssignments(
        savedProgram.programId,
        assignedClientIds || []
      )

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

      const { assignedClientIds, ...programData } = updatedProgram

      await updateProgram(programData)

      await syncClientAssignments(
        updatedProgram.programId,
        assignedClientIds || []
      )

      await loadPrograms()
      setSelectedProgram(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdateProgram'))
    }
  }

  async function handleDeleteProgram(programId) {
    const confirmed = window.confirm(
      t('confirmDeleteProgram')
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      const assignmentsToRemove = clientPrograms.filter(
        (assignment) => assignment.programId === programId
      )

      for (const assignment of assignmentsToRemove) {
        await removeProgramAssignment(assignment.assignmentId)
      }

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

        <button
          onClick={
            showForm
              ? handleCancelForm
              : () => setShowForm(true)
          }
        >
          {showForm
            ? t('cancel')
            : t('addProgram')}
        </button>
      </div>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {showForm && (
        <ProgramForm
          clients={clients}
          selectedClientIds={
            selectedProgram
              ? getAssignedClientIds(selectedProgram.programId)
              : []
          }
          onAddProgram={handleAddProgram}
          onUpdateProgram={handleUpdateProgram}
          selectedProgram={selectedProgram}
        />
      )}

      {programs.length === 0 ? (
        <p>{t('noProgramsYet')}</p>
      ) : (
        <div className="client-grid">
          {programs.map((program) => (
            <ProgramCard
              key={program.programId}
              program={program}
              assignedClients={getAssignedClients(program.programId)}
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