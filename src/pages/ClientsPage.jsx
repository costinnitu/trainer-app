import { useEffect, useState } from 'react'

import ClientCard from '../components/ClientCard'
import ClientForm from '../components/ClientForm'

import {
  getClients,
  createClient,
  deleteClient,
  updateClient,
} from '../services/clientService'

import { getPrograms } from '../services/programService'

import {
  getClientPrograms,
  assignProgramToClient,
  removeProgramAssignment,
} from '../services/clientProgramService'

import useTranslations from '../hooks/useTranslations'

function ClientsPage() {
  const { t } = useTranslations()

  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState([])
  const [programs, setPrograms] = useState([])
  const [clientPrograms, setClientPrograms] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    refreshClients()
  }, [])

  async function refreshClients() {
    try {
      setIsLoading(true)
      setError('')

      const [clientsData, programsData, assignmentsData] =
        await Promise.all([
          getClients(),
          getPrograms(),
          getClientPrograms(),
        ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setPrograms(Array.isArray(programsData) ? programsData : [])
      setClientPrograms(
        Array.isArray(assignmentsData) ? assignmentsData : []
      )
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadClients'))
    } finally {
      setIsLoading(false)
    }
  }

  function getAssignedProgramIds(clientId) {
    return clientPrograms
      .filter((assignment) => assignment.clientId === clientId)
      .map((assignment) => assignment.programId)
  }

  function getAssignedPrograms(clientId) {
    const assignedProgramIds = getAssignedProgramIds(clientId)

    return programs.filter((program) =>
      assignedProgramIds.includes(program.programId)
    )
  }

  async function syncProgramAssignments(clientId, selectedProgramIds) {
    const existingAssignments = clientPrograms.filter(
      (assignment) => assignment.clientId === clientId
    )

    const existingProgramIds = existingAssignments.map(
      (assignment) => assignment.programId
    )

    const programsToAdd = selectedProgramIds.filter(
      (programId) => !existingProgramIds.includes(programId)
    )

    const assignmentsToRemove = existingAssignments.filter(
      (assignment) => !selectedProgramIds.includes(assignment.programId)
    )

    for (const programId of programsToAdd) {
      await assignProgramToClient({
        clientId,
        programId,
      })
    }

    for (const assignment of assignmentsToRemove) {
      await removeProgramAssignment(assignment.assignmentId)
    }
  }

  async function handleAddClient(newClient) {
    try {
      setError('')

      const { assignedProgramIds, ...clientData } = newClient

      const savedClient = await createClient(clientData)

      await syncProgramAssignments(
        savedClient.clientId,
        assignedProgramIds || []
      )

      await refreshClients()
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveClient'))
    }
  }

  async function handleDeleteClient(clientId) {
    const confirmed = window.confirm(t('confirmDeleteClient'))

    if (!confirmed) {
      return
    }

    try {
      setError('')

      const assignmentsToRemove = clientPrograms.filter(
        (assignment) => assignment.clientId === clientId
      )

      for (const assignment of assignmentsToRemove) {
        await removeProgramAssignment(assignment.assignmentId)
      }

      await deleteClient(clientId)
      await refreshClients()
    } catch (error) {
      console.error(error)
      setError(t('couldNotDeleteClient'))
    }
  }

  function handleEditClient(client) {
    setSelectedClient(client)
    setShowForm(true)
  }

  async function handleUpdateClient(updatedClient) {
    try {
      setError('')

      const { assignedProgramIds, ...clientData } = updatedClient

      await updateClient(clientData)

      await syncProgramAssignments(
        updatedClient.clientId,
        assignedProgramIds || []
      )

      await refreshClients()
      setSelectedClient(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdateClient'))
    }
  }

  function handleCancelForm() {
    setSelectedClient(null)
    setShowForm(false)
  }

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase()

    return fullName.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('clients')}</h2>

        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
          {showForm ? t('cancel') : t('addClient')}
        </button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder={t('searchClients')}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {showForm && (
        <ClientForm
          programs={programs}
          selectedProgramIds={
            selectedClient
              ? getAssignedProgramIds(selectedClient.clientId)
              : []
          }
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          selectedClient={selectedClient}
        />
      )}

      {isLoading && <p>{t('loadingClients')}</p>}

      {error && <p className="error-message">{error}</p>}

      <div className="client-list">
        <div className="client-row client-row-header">
          <strong>{t('client')}</strong>
          <strong>{t('status')}</strong>
          <strong>{t('phone')}</strong>
          <strong>{t('goal')}</strong>
          <strong>{t('assignedPrograms')}</strong>
          <div></div>
        </div>

        {filteredClients.map((client) => (
          <ClientCard
            key={client.clientId}
            client={client}
            assignedPrograms={getAssignedPrograms(client.clientId)}
            onDeleteClient={handleDeleteClient}
            onEditClient={handleEditClient}
          />
        ))}
      </div>
    </div>
  )
}

export default ClientsPage