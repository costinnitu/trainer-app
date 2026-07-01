import { useEffect, useState } from 'react'
import ClientForm from '../components/clients/ClientForm'
import { getPackages } from '../services/packageService'
import ContactsSection from '../components/contacts/ContactsSection'
import ClientsListSection from '../components/clients/ClientsListSection'
import SearchBar from '../components/common/SearchBar'
import {
  getClients,
  createClient,
  deleteClient,
  updateClient,
} from '../services/clientService'

import {
  getPrograms,
  createProgram,
} from '../services/programService'

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
  const [clientPackages, setClientPackages] = useState([])
  const [appointments, setAppointments] = useState([])
  const [payments, setPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [packageLibrary, setPackageLibrary] = useState([])  
  const [mobileView, setMobileView] = useState('clients')
  const [clientStatusPreferences, setClientStatusPreferences] = useState({
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
  packageLibraryData,
  assignmentsData,
  appointmentsData,
  preferencesData,
  paymentsData,
  packagesData,
] = await Promise.all([
        getClients(),
        getPrograms(),
        getPackages(),
        getClientPrograms(),
        getAppointments(),
        getClientStatusPreferences(),
        getPayments(),
        getClientPackages(),
      ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setPrograms(Array.isArray(programsData) ? programsData : [])
      setClientPrograms(Array.isArray(assignmentsData) ? assignmentsData : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
      setClientPackages(Array.isArray(packagesData) ? packagesData : [])
      setPackageLibrary(
  Array.isArray(packageLibraryData)
    ? packageLibraryData
    : []
)

      if (preferencesData) {
        setClientStatusPreferences({
          enableAutoStatus: preferencesData.enableAutoStatus ?? true,
          autoPauseAfterDays: preferencesData.autoPauseAfterDays || 30,
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

    return activePackages[0] || null
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
    if (!clientStatusPreferences.enableAutoStatus) {
      return client.status
    }

    if (client.status === 'inactive') {
      return 'inactive'
    }

    const clientAppointments = appointments.filter(
      (appointment) => appointment.clientId === client.clientId
    )

    if (clientAppointments.length === 0) {
      return 'paused'
    }

    const sortedAppointments = [...clientAppointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`)
      const dateB = new Date(`${b.date}T${b.startTime}`)

      return dateB - dateA
    })

    const latestAppointment = sortedAppointments[0]
    const latestDate = new Date(
      `${latestAppointment.date}T${latestAppointment.startTime}`
    )

    const differenceInDays =
      (new Date() - latestDate) / (1000 * 60 * 60 * 24)

    if (differenceInDays > clientStatusPreferences.autoPauseAfterDays) {
      return 'paused'
    }

    return 'active'
  }

  function getPaymentForItem(itemType, itemId) {
    return payments.find(
      (payment) =>
        payment.itemType === itemType &&
        payment.itemId === itemId
    )
  }

  function getPaymentForPackage(packageId) {
    return getPaymentForItem('package', packageId)
  }

  function getClientPaymentHealth(clientId) {
    const clientBillableItems = [
      ...clientPackages
        .filter((clientPackage) => clientPackage.clientId === clientId)
        .map((clientPackage) => ({
          itemType: 'package',
          itemId: clientPackage.packageId,
        })),

      ...appointments
        .filter(
          (appointment) =>
            appointment.clientId === clientId &&
            !appointment.packageId
        )
        .map((appointment) => ({
          itemType: 'appointment',
          itemId: appointment.appointmentId,
        })),

      ...clientPrograms
        .filter((assignment) => assignment.clientId === clientId)
        .map((assignment) => ({
          itemType: 'program',
          itemId: assignment.assignmentId,
        })),
    ]

    if (clientBillableItems.length === 0) {
      return 'none'
    }

    const unpaidItems = clientBillableItems.filter((item) => {
      const payment = getPaymentForItem(item.itemType, item.itemId)

      return !payment || payment.status !== 'paid'
    })

    if (unpaidItems.length === 0) {
      return 'paid'
    }

    if (unpaidItems.length === clientBillableItems.length) {
      return 'unpaid'
    }

    return 'partial'
  }

  async function upsertPackagePayment(savedPackage, paymentStatus) {
  const freshPayments = await getPayments()

  const existingPayment = freshPayments.find(
    (payment) =>
      payment.itemType === 'package' &&
      payment.itemId === savedPackage.packageId
  )

  const paymentPayload = {
    clientId: savedPackage.clientId,
    clientName: savedPackage.clientName,
    itemType: 'package',
    itemId: savedPackage.packageId,
    description: savedPackage.packageName,
    amount: Number(savedPackage.amount || 0),
    status: paymentStatus,
    paidAt:
      paymentStatus === 'paid'
        ? existingPayment?.paidAt || new Date().toISOString()
        : null,
    method: existingPayment?.method || 'other',
    notes: savedPackage.notes || '',
  }

  if (existingPayment) {
    await updatePayment({
      ...existingPayment,
      ...paymentPayload,
    })
  } else {
    await createPayment(paymentPayload)
  }
}

  async function handleAddPackage(newPackage) {
  try {
    setError('')

    const savedPackage = await createClientPackage(newPackage)

    const paymentStatus =
      newPackage.paymentStatus ||
      savedPackage.paymentStatus ||
      'unpaid'

    await upsertPackagePayment(savedPackage, paymentStatus)

    const [paymentsData, packagesData] = await Promise.all([
      getPayments(),
      getClientPackages(),
    ])

    setPayments(Array.isArray(paymentsData) ? paymentsData : [])
    setClientPackages(Array.isArray(packagesData) ? packagesData : [])

    setShowForm(true)
  } catch (error) {
    console.error(error)
    setError(t('couldNotSavePackage'))
  }
}

  async function handleUpdatePackage(updatedPackage) {
    try {
      setError('')

      const savedPackage = await updateClientPackage(updatedPackage)

      const paymentStatus =
        updatedPackage.paymentStatus ||
        savedPackage.paymentStatus ||
        'unpaid'

      await upsertPackagePayment(savedPackage, paymentStatus)

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

      setSelectedClient({
        ...clientData,
        assignedProgramIds: updatedClient.assignedProgramIds || [],
      })
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdateClient'))
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

  async function handleCreateProgramFromClient(newProgram) {
  try {
    setError('')

    const savedProgram = await createProgram(newProgram)

    await refreshClients()

    return savedProgram
  } catch (error) {
    console.error(error)
    setError(t('couldNotSaveProgram'))
    return null
  }
}

  function handleEditClient(client) {
    setSelectedClient(client)
    setShowForm(true)
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
      </div>

 {!showForm && (
  <div className="client-view-tabs">
    <button
      type="button"
      className={mobileView === 'clients' ? 'active' : ''}
      onClick={() => setMobileView('clients')}
    >
      {t('clients')}
    </button>

    <button
      type="button"
      className={mobileView === 'contacts' ? 'active' : ''}
      onClick={() => setMobileView('contacts')}
    >
      {t('contacts')}
    </button>
  </div>
)}

{showForm && (
  <ClientForm
    programs={programs}
    payments={payments}
    packageLibrary={packageLibrary}
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
    onCreateProgram={handleCreateProgramFromClient}
    selectedClient={selectedClient}
    onCancel={handleCancelForm}
  />
)}

{isLoading && <p>{t('loadingClients')}</p>}

{error && <p className="error-message">{error}</p>}

{!showForm && mobileView === 'clients' && (
  <>
    <SearchBar
      placeholder={t('searchClients')}
      value={searchTerm}
      onChange={setSearchTerm}
    />

    <ClientsListSection
      clients={filteredClients}
      getComputedClientStatus={getComputedClientStatus}
      getClientPaymentHealth={getClientPaymentHealth}
      getActivePackage={getActivePackage}
      getAssignedPrograms={getAssignedPrograms}
      onDeleteClient={handleDeleteClient}
      onEditClient={handleEditClient}
      onAddClient={() => {
        setSelectedClient(null)
        setShowForm(true)
      }}
    />
  </>
)}

{!showForm && mobileView === 'contacts' && (
  <ContactsSection
    clients={clients}
    onClientsChanged={refreshClients}
  />
)}

{!showForm && <div className="mobile-bottom-spacer" />}
    </div>
  )
}

export default ClientsPage