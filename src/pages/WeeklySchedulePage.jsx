import { useEffect, useState } from 'react'

import { getSchedulePreferences } from '../services/settingsService'

import AppointmentForm from '../components/AppointmentForm'

import { getClients } from '../services/clientService'

import {
  getAppointments,
  updateAppointment,
} from '../services/appointmentService'

function WeeklySchedulePage() {
  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedWeekDate, setSelectedWeekDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('list')
  const [error, setError] = useState('')
  const [schedulePreferences, setSchedulePreferences] = useState({
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '07:00',
  workEndTime: '20:00',
})

  const calendarStartHour = Number(schedulePreferences.workStartTime.split(':')[0])
  const calendarEndHour = Number(schedulePreferences.workEndTime.split(':')[0])
  const hourHeight = 64

  useEffect(() => {
    loadPageData()
  }, [])

  async function loadPageData() {
  try {
    const clientsData = await getClients()
    const appointmentsData = await getAppointments()
    const scheduleData = await getSchedulePreferences()

    setClients(Array.isArray(clientsData) ? clientsData : [])
    setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])

    if (scheduleData) {
      setSchedulePreferences({
        workingDays: scheduleData.workingDays || [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
        ],
        workStartTime: scheduleData.workStartTime || '07:00',
        workEndTime: scheduleData.workEndTime || '20:00',
      })
    }
  } catch (error) {
      console.error(error)
      setError('Could not load weekly schedule')
    }
  }

  function getStartOfWeek(date) {
    const currentDate = new Date(date)
    const day = currentDate.getDay()
    const diff = day === 0 ? -6 : 1 - day

    currentDate.setDate(currentDate.getDate() + diff)
    currentDate.setHours(0, 0, 0, 0)

    return currentDate
  }

  function formatDateForInput(date) {
    return date.toLocaleDateString('en-CA')
  }

  function goToPreviousWeek() {
    const previousWeek = new Date(selectedWeekDate)
    previousWeek.setDate(selectedWeekDate.getDate() - 7)
    setSelectedWeekDate(previousWeek)
  }

  function goToNextWeek() {
    const nextWeek = new Date(selectedWeekDate)
    nextWeek.setDate(selectedWeekDate.getDate() + 7)
    setSelectedWeekDate(nextWeek)
  }

  function goToCurrentWeek() {
    setSelectedWeekDate(new Date())
  }

  function getAppointmentsForDay(dateValue) {
    return appointments
      .filter((appointment) => appointment.date === dateValue)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  function getAppointmentPosition(appointment) {
    const [startHour, startMinute] = appointment.startTime
      .split(':')
      .map(Number)

    const [endHour, endMinute] = appointment.endTime
      .split(':')
      .map(Number)

    const startTotalMinutes = startHour * 60 + startMinute
    const endTotalMinutes = endHour * 60 + endMinute
    const calendarStartMinutes = calendarStartHour * 60

    const top =
      ((startTotalMinutes - calendarStartMinutes) / 60) * hourHeight

    const height =
      ((endTotalMinutes - startTotalMinutes) / 60) * hourHeight

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  function getCurrentTimePosition() {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const calendarStartMinutes = calendarStartHour * 60
    const calendarEndMinutes = calendarEndHour * 60

    if (
      currentMinutes < calendarStartMinutes ||
      currentMinutes > calendarEndMinutes
    ) {
      return null
    }

    return `${((currentMinutes - calendarStartMinutes) / 60) * hourHeight}px`
  }

  function handleEditAppointment(appointment) {
    setSelectedAppointment(appointment)
  }

  async function handleUpdateAppointment(updatedAppointment) {
    const overlappingAppointment = appointments.find((appointment) => {
      if (appointment.appointmentId === updatedAppointment.appointmentId) {
        return false
      }

      if (appointment.date !== updatedAppointment.date) {
        return false
      }

      return (
        updatedAppointment.startTime < appointment.endTime &&
        updatedAppointment.endTime > appointment.startTime
      )
    })

    if (overlappingAppointment) {
      alert('This appointment overlaps with another appointment.')
      return
    }

    await updateAppointment(updatedAppointment)
    await loadPageData()
    setSelectedAppointment(null)
  }

  function handleCancelEdit() {
    setSelectedAppointment(null)
  }

  const startOfWeek = getStartOfWeek(selectedWeekDate)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const weekLabel = `${startOfWeek.toLocaleDateString(
    'it-IT'
  )} - ${endOfWeek.toLocaleDateString('it-IT')}`

  const today = new Date().toLocaleDateString('en-CA')
  const currentTimePosition = getCurrentTimePosition()

  const dayNameMap = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
}

  const weekDays = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(startOfWeek)
  date.setDate(startOfWeek.getDate() + index)

  return {
    dayIndex: date.getDay(),
    label: date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    }),
    dateValue: formatDateForInput(date),
  }
}).filter((day) =>
  schedulePreferences.workingDays.some(
    (workingDay) => dayNameMap[workingDay] === day.dayIndex
  )
)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Weekly Schedule</h2>
          <p className="week-label">{weekLabel}</p>

          <div className="view-toggle">
            <button onClick={() => setViewMode('list')}>List View</button>
            <button onClick={() => setViewMode('calendar')}>
              Calendar View
            </button>
          </div>
        </div>

        <div className="week-navigation">
          <button onClick={goToPreviousWeek}>Previous</button>
          <button onClick={goToCurrentWeek}>Today</button>
          <button onClick={goToNextWeek}>Next</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {selectedAppointment && (
        <div>
          <button className="danger-button" onClick={handleCancelEdit}>
            Cancel Edit
          </button>

          <AppointmentForm
            clients={clients}
            selectedAppointment={selectedAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onAddAppointment={() => {}}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="weekly-grid">
          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day.dateValue)
            const isToday = day.dateValue === today

            return (
              <div
                className={`weekly-day ${isToday ? 'today-highlight' : ''}`}
                key={day.dateValue}
              >
                <h3>{day.label}</h3>

                {dayAppointments.length === 0 ? (
                  <p className="empty-day">No appointments</p>
                ) : (
                  dayAppointments.map((appointment) => (
                    <div
                      className="weekly-appointment clickable-appointment"
                      key={appointment.appointmentId}
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <strong>
                        {appointment.startTime} - {appointment.endTime}
                      </strong>

                      <span>{appointment.clientName}</span>

                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="calendar-grid">
          <div className="calendar-time-column">
            <div className="calendar-header-cell"></div>

            {Array.from(
              { length: calendarEndHour - calendarStartHour + 1 },
                (_, index) => {
              const hour = index + calendarStartHour

              return (
                <div className="calendar-time-slot" key={hour}>
                  {String(hour).padStart(2, '0')}:00
                </div>
              )
            })}
          </div>

          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day.dateValue)
            const isToday = day.dateValue === today

            return (
              <div
                className={`calendar-day-column ${
                  isToday ? 'today-highlight' : ''
                }`}
                key={day.dateValue}
              >
                <div className="calendar-day-header">{day.label}</div>

                <div className="calendar-day-body">
                  {isToday && currentTimePosition && (
                    <div
                      className="current-time-line"
                      style={{ top: currentTimePosition }}
                    />
                  )}

                  {dayAppointments.map((appointment) => (
                    <div
                      className={`calendar-appointment ${appointment.status}`}
                      key={appointment.appointmentId}
                      style={getAppointmentPosition(appointment)}
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <strong>
                        {appointment.startTime} - {appointment.endTime}
                      </strong>

                      <span>{appointment.clientName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WeeklySchedulePage