import { useEffect, useState } from 'react'

import AppointmentCard from '../components/AppointmentCard'
import AppointmentForm from '../components/AppointmentForm'

import { getClients } from '../services/clientService'
import {
  getAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from '../services/appointmentService'

function AppointmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPageData()
  }, [])

  async function loadPageData() {
    try {
      setIsLoading(true)
      setError('')

      const clientsData = await getClients()
      const appointmentsData = await getAppointments()

      setClients(clientsData)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error(error)
      setError('Could not load appointments')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddAppointment(newAppointment) {
    await createAppointment(newAppointment)
    await loadPageData()
    setShowForm(false)
  }

  async function handleDeleteAppointment(appointmentId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this appointment?'
    )

    if (!confirmed) {
      return
    }

    await deleteAppointment(appointmentId)
    await loadPageData()
  }

  function handleEditAppointment(appointment) {
    setSelectedAppointment(appointment)
    setShowForm(true)
  }

  async function handleUpdateAppointment(updatedAppointment) {
    await updateAppointment(updatedAppointment)
    await loadPageData()
    setSelectedAppointment(null)
    setShowForm(false)
  }

  function handleCancelForm() {
    setSelectedAppointment(null)
    setShowForm(false)
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`)
    const dateB = new Date(`${b.date}T${b.startTime}`)

    return dateA - dateB
  })

  return (
    <div className="page">
      <div className="page-header">
        <h2>Appointments</h2>

        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Appointment'}
        </button>
      </div>

      {showForm && (
        <AppointmentForm
          clients={clients}
          onAddAppointment={handleAddAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          selectedAppointment={selectedAppointment}
        />
      )}

      {isLoading && <p>Loading appointments...</p>}

      {error && <p className="error-message">{error}</p>}

      {sortedAppointments.length === 0 && !isLoading && (
  <p>No appointments yet.</p>
)}

<div className="client-grid">
  {sortedAppointments.map((appointment) => (
    <AppointmentCard
      key={appointment.appointmentId}
      appointment={appointment}
      onDeleteAppointment={handleDeleteAppointment}
      onEditAppointment={handleEditAppointment}
    />
  ))}
</div>
    </div>
  )
}

export default AppointmentsPage