import { useEffect, useState } from 'react'

import { getClients } from '../services/clientService'
import { getAppointments } from '../services/appointmentService'

import useTranslations from '../hooks/useTranslations'

function DashboardPage() {
  const { t, language } = useTranslations()

  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')

  const locale = language === 'it' ? 'it-IT' : 'en-US'

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
      setError(t('couldNotLoadDashboardData'))
    }
  }

  function getTranslatedStatus(status) {
    switch (status) {
      case 'scheduled':
        return t('scheduled')

      case 'completed':
        return t('completed')

      case 'cancelled':
        return t('cancelled')

      default:
        return status
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
      <h2>{t('dashboard')}</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>{t('totalClients')}</h3>
          <p>{clients.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>{t('activeClients')}</h3>
          <p>{activeClients.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>{t('todaysAppointments')}</h3>
          <p>{todayAppointments.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>{t('upcomingAppointments')}</h3>
          <p>{upcomingAppointments.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>{t('todaysAppointments')}</h3>

        {sortedTodayAppointments.length === 0 ? (
          <p>{t('noAppointmentsToday')}</p>
        ) : (
          sortedTodayAppointments.map((appointment) => (
            <div
              className="dashboard-list-item"
              key={appointment.appointmentId}
            >
              <strong>{appointment.startTime}</strong>

              <span>{appointment.clientName}</span>

              <span className={`status-badge ${appointment.status}`}>
                {getTranslatedStatus(appointment.status)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-section">
        <h3>{t('upcomingAppointments')}</h3>

        {sortedUpcomingAppointments.length === 0 ? (
          <p>{t('noUpcomingAppointments')}</p>
        ) : (
          sortedUpcomingAppointments.slice(0, 5).map((appointment) => (
            <div
              className="dashboard-list-item"
              key={appointment.appointmentId}
            >
              <strong>
                {new Date(appointment.date).toLocaleDateString(locale)}
              </strong>

              <span>
                {appointment.startTime} - {appointment.clientName}
              </span>

              <span className={`status-badge ${appointment.status}`}>
                {getTranslatedStatus(appointment.status)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DashboardPage