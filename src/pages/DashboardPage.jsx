import { useEffect, useState } from 'react'

import { getClients } from '../services/clientService'
import { getAppointments } from '../services/appointmentService'

function DashboardPage() {
  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setError('')

      const clientsData = await getClients()
      const appointmentsData = await getAppointments()

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
    } catch (error) {
      console.error(error)
      setError('Could not load dashboard data')
    }
  }

  const today = new Date().toLocaleDateString('en-CA')

  const activeClients = clients.filter(
    (client) => client.status === 'active'
  )

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today
  )

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.date >= today
  )

  const sortedTodayAppointments = [...todayAppointments].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  const sortedUpcomingAppointments = [...upcomingAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`)
    const dateB = new Date(`${b.date}T${b.startTime}`)

    return dateA - dateB
  })

  return (
    <div className="page">
      <h2>Dashboard</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Clients</h3>
          <p>{clients.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Clients</h3>
          <p>{activeClients.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Today’s Appointments</h3>
          <p>{todayAppointments.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Appointments</h3>
          <p>{upcomingAppointments.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Today’s Appointments</h3>

        {sortedTodayAppointments.length === 0 ? (
          <p>No appointments today.</p>
        ) : (
          sortedTodayAppointments.map((appointment) => (
            <div
              className="dashboard-list-item"
              key={appointment.appointmentId}
            >
              <strong>{appointment.startTime}</strong>
              <span>{appointment.clientName}</span>
              <span className={`status-badge ${appointment.status}`}>
                {appointment.status}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-section">
        <h3>Upcoming Appointments</h3>

        {sortedUpcomingAppointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          sortedUpcomingAppointments.slice(0, 5).map((appointment) => (
            <div
              className="dashboard-list-item"
              key={appointment.appointmentId}
            >
              <strong>
                {new Date(appointment.date).toLocaleDateString('it-IT')}
              </strong>

              <span>
                {appointment.startTime} - {appointment.clientName}
              </span>

              <span className={`status-badge ${appointment.status}`}>
                {appointment.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DashboardPage