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
import { getAppointments } from '../services/appointmentService'
import {
  getClientStatusPreferences,
} from '../services/settingsService'
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '../services/paymentService'
import {
  getClientPackages,
  createClientPackage,
  updateClientPackage,
  deleteClientPackage,
} from '../services/clientPackageService'
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
  const [clientPackages, setClientPackages] = useState([])
  const [appointments, setAppointments] = useState([])
  const [payments, setPayments] = useState([])

  const [clientStatusPreferences, setClientStatusPreferences] =
  useState({
    enableAutoStatus: true,
    autoPauseAfterDays: 30,
  })

  useEffect(() => {
    refreshClients()
  }, [])

  async function refreshClients() {
    try {
      setIsLoading(true)
      setError('')

     const [
  clientsData,
  programsData,
  assignmentsData,
  appointmentsData,
  preferencesData,
  paymentsData,
  packagesData,
] = await Promise.all([
  getClients(),
  getPrograms(),
  getClientPrograms(),
  getAppointments(),
  getClientStatusPreferences(),
  getPayments(),
  getClientPackages(),
])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setPrograms(Array.isArray(programsData) ? programsData : [])
      setClientPrograms(
        Array.isArray(assignmentsData) ? assignmentsData : []
      )
      setAppointments(
        Array.isArray(appointmentsData)
        ? appointmentsData
        : []
      )
      setPayments(
        Array.isArray(paymentsData)
          ? paymentsData
          : []
      )
      setClientPackages(
        Array.isArray(packagesData) ? packagesData : []
      )

if (preferencesData) {
  setClientStatusPreferences({
    enableAutoStatus:
      preferencesData.enableAutoStatus ?? true,

    autoPauseAfterDays:
      preferencesData.autoPauseAfterDays || 30,
  })
}
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadClients'))
    } finally {
      setIsLoading(false)
    }
  }

  function getPackagesForClient(clientId) {
  return clientPackages.filter(
    (clientPackage) => clientPackage.clientId === clientId
  )
}

  function getActivePackage(clientId) {
  const activePackages = clientPackages.filter(
    (clientPackage) =>
      clientPackage.clientId === clientId &&
      Number(clientPackage.remainingSessions || 0) > 0
  )

  if (activePackages.length === 0) {
    return null
  }

  return activePackages[0]
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

  function getComputedClientStatus(client) {
  if (
    !clientStatusPreferences.enableAutoStatus
  ) {
    return client.status
  }

  if (client.status === 'inactive') {
    return 'inactive'
  }

  const today = new Date()

  const clientAppointments = appointments.filter(
    (appointment) =>
      appointment.clientId === client.clientId
  )

  if (clientAppointments.length === 0) {
    return 'paused'
  }

  const sortedAppointments =
    [...clientAppointments].sort((a, b) => {
      const dateA = new Date(
        `${a.date}T${a.startTime}`
      )

      const dateB = new Date(
        `${b.date}T${b.startTime}`
      )

      return dateB - dateA
    })

  const latestAppointment =
    sortedAppointments[0]

  const latestDate = new Date(
    `${latestAppointment.date}T${latestAppointment.startTime}`
  )

  const differenceInDays =
    (today - latestDate) /
    (1000 * 60 * 60 * 24)

  if (
    differenceInDays >
    clientStatusPreferences.autoPauseAfterDays
  ) {
    return 'paused'
  }

  return 'active'
}

function getClientPaymentHealth(clientId) {
  const clientAppointments = appointments.filter(
    (appointment) =>
      appointment.clientId === clientId
  )

  const clientAssignments = clientPrograms.filter(
    (assignment) =>
      assignment.clientId === clientId
  )

  const billableItems = [
    ...clientAppointments.map((appointment) => ({
      itemType: 'appointment',
      itemId: appointment.appointmentId,
    })),

    ...clientAssignments.map((assignment) => ({
      itemType: 'program',
      itemId: assignment.assignmentId,
    })),
  ]

  if (billableItems.length === 0) {
    return 'none'
  }

  let paidCount = 0

  for (const item of billableItems) {
    const payment = payments.find(
      (payment) =>
        payment.itemType === item.itemType &&
        payment.itemId === item.itemId
    )

    if (payment?.status === 'paid') {
      paidCount++
    }
  }

  if (paidCount === 0) {
    return 'unpaid'
  }

  if (paidCount === billableItems.length) {
    return 'paid'
  }

  return 'partial'
}

function getPaymentForPackage(packageId) {
  return payments.find(
    (payment) =>
      payment.itemType === 'package' &&
      payment.itemId === packageId
  )
}


async function handleAddPackage(newPackage) {
  try {
    setError('')

    const savedPackage = await createClientPackage(newPackage)

    await createPayment({
      clientId: savedPackage.clientId,
      clientName: savedPackage.clientName,
      itemType: 'package',
      itemId: savedPackage.packageId,
      description: savedPackage.packageName,
      amount: Number(savedPackage.amount || 0),
      status: savedPackage.paymentStatus || 'unpaid',
      paidAt:
        savedPackage.paymentStatus === 'paid'
          ? new Date().toISOString()
          : null,
      method: 'other',
      notes: savedPackage.notes || '',
    })

    await refreshClients()
  } catch (error) {
    console.error(error)
    setError(t('couldNotSavePackage'))
  }
}

async function handleUpdatePackage(updatedPackage) {
  try {
    setError('')

    const savedPackage = await updateClientPackage(updatedPackage)
    const existingPayment = getPaymentForPackage(savedPackage.packageId)

    if (existingPayment) {
      await updatePayment({
        ...existingPayment,
        clientId: savedPackage.clientId,
        clientName: savedPackage.clientName,
        itemType: 'package',
        itemId: savedPackage.packageId,
        description: savedPackage.packageName,
        amount: Number(savedPackage.amount || 0),
        status: savedPackage.paymentStatus || 'unpaid',
        paidAt:
          savedPackage.paymentStatus === 'paid'
            ? existingPayment.paidAt || new Date().toISOString()
            : null,
        notes: savedPackage.notes || '',
      })
    } else {
      await createPayment({
        clientId: savedPackage.clientId,
        clientName: savedPackage.clientName,
        itemType: 'package',
        itemId: savedPackage.packageId,
        description: savedPackage.packageName,
        amount: Number(savedPackage.amount || 0),
        status: savedPackage.paymentStatus || 'unpaid',
        paidAt:
          savedPackage.paymentStatus === 'paid'
            ? new Date().toISOString()
            : null,
        method: 'other',
        notes: savedPackage.notes || '',
      })
    }

    await refreshClients()
  } catch (error) {
    console.error(error)
    setError(t('couldNotUpdatePackage'))
  }
}

async function handleDeletePackage(packageId) {
  const confirmed = window.confirm(t('confirmDeletePackage'))

  if (!confirmed) {
    return
  }

  try {
    setError('')

    const existingPayment = getPaymentForPackage(packageId)

    if (existingPayment) {
      await deletePayment(existingPayment.paymentId)
    }

    await deleteClientPackage(packageId)
    await refreshClients()
  } catch (error) {
    console.error(error)
    setError(t('couldNotDeletePackage'))
  }
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
  clientPackages={
    selectedClient
      ? getPackagesForClient(selectedClient.clientId)
      : []
  }
  selectedProgramIds={
    selectedClient
      ? getAssignedProgramIds(selectedClient.clientId)
      : []
  }
  onAddClient={handleAddClient}
  onUpdateClient={handleUpdateClient}
  onAddPackage={handleAddPackage}
  onUpdatePackage={handleUpdatePackage}
  onDeletePackage={handleDeletePackage}
  selectedClient={selectedClient}
/>
      )}

      {isLoading && <p>{t('loadingClients')}</p>}

      {error && <p className="error-message">{error}</p>}

      <div className="client-list">
        <div className="client-row client-row-header">
          <strong>{t('client')}</strong>
          <strong>{t('status')}</strong>
          <strong>WhatsApp</strong>
          <strong>{t('activePackage')}</strong>
          <strong>{t('assignedPrograms')}</strong>
          <strong>{t('payments')}</strong>
          <div></div>
        </div>

        {filteredClients.map((client) => (
          <ClientCard
            key={client.clientId}
          client={{
            ...client,
            status: getComputedClientStatus(client),
          }}
            paymentHealth={getClientPaymentHealth(client.clientId)}
            activePackage={getActivePackage(client.clientId)}
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