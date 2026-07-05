import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClients } from '../services/clientService'
import { getAppointments } from '../services/appointmentService'
import { getClientStatusPreferences } from '../services/settingsService'
import useTranslations from '../hooks/useTranslations'

function DashboardPage() {
  const navigate = useNavigate()
  const { t, language } = useTranslations()

  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [clientStatusPreferences, setClientStatusPreferences] = useState({
  enableAutoStatus: true,
  autoPauseAfterDays: 30,
})
  const locale = language === 'it' ? 'it-IT' : 'en-US'

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setError('')

      const [clientsData, appointmentsData, preferencesData] = await Promise.all([
          getClients(),
          getAppointments(),
          getClientStatusPreferences(),
        ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
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

  function getComputedClientStatus(client) {
  if (!clientStatusPreferences.enableAutoStatus) {
    return client.status
  }

  if (client.status === 'inactive') {
    return 'inactive'
  }

  const today = new Date()

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
    (today - latestDate) / (1000 * 60 * 60 * 24)

  if (differenceInDays > clientStatusPreferences.autoPauseAfterDays) {
    return 'paused'
  }

  return 'active'
}



  const today = new Date().toLocaleDateString('en-CA')

  const activeClients = clients.filter(
  (client) => getComputedClientStatus(client) === 'active'
)
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today
  )

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.date >= today
  )

  const sortedTodayAppointments = [...todayAppointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )

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
        <div
          className="dashboard-card clickable-dashboard-card"
          onClick={() => navigate('/clients')}
        >
          <h3>{t('totalClients')}</h3>
          <p>{clients.length}</p>
        </div>

        <div
          className="dashboard-card clickable-dashboard-card"
          onClick={() => setCurrentPage('clients')}
        >
          <h3>{t('activeClients')}</h3>
          <p>{activeClients.length}</p>
        </div>

        <div
          className="dashboard-card clickable-dashboard-card"
          onClick={() => navigate('/schedule')}
        >
          <h3>{t('todaysAppointments')}</h3>
          <p>{todayAppointments.length}</p>
        </div>

        <div
          className="dashboard-card clickable-dashboard-card"
          onClick={() => setCurrentPage('weeklySchedule')}
        >
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