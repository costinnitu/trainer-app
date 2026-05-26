import { useEffect, useState } from 'react'

import AppointmentForm from '../components/AppointmentForm'

import { getClients } from '../services/clientService'
import { getSchedulePreferences } from '../services/settingsService'
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentService'

const DEFAULT_SCHEDULE = {
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workStartTime: '07:00',
  workEndTime: '20:00',
  defaultSessionDuration: 60,
}

const DAY_NAME_MAP = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
}

const HOUR_HEIGHT = 64

function WeeklySchedulePage() {
  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [schedulePreferences, setSchedulePreferences] =
    useState(DEFAULT_SCHEDULE)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [initialAppointment, setInitialAppointment] = useState(null)
  const [selectedWeekDate, setSelectedWeekDate] = useState(new Date())
  const [error, setError] = useState('')

  const calendarStartHour = Number(
    schedulePreferences.workStartTime.split(':')[0]
  )
  const calendarEndHour = Number(
    schedulePreferences.workEndTime.split(':')[0]
  )

  useEffect(() => {
    loadPageData()
  }, [])

  async function loadPageData() {
    try {
      setError('')

      const [clientsData, appointmentsData, scheduleData] = await Promise.all([
        getClients(),
        getAppointments(),
        getSchedulePreferences(),
      ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])

      if (scheduleData) {
        setSchedulePreferences({
          workingDays:
            scheduleData.workingDays || DEFAULT_SCHEDULE.workingDays,
          workStartTime:
            scheduleData.workStartTime || DEFAULT_SCHEDULE.workStartTime,
          workEndTime:
            scheduleData.workEndTime || DEFAULT_SCHEDULE.workEndTime,
          defaultSessionDuration:
            scheduleData.defaultSessionDuration ||
            DEFAULT_SCHEDULE.defaultSessionDuration,
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

  function getWeekDays() {
    const startOfWeek = getStartOfWeek(selectedWeekDate)

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)

      return {
        dayIndex: date.getDay(),
       label: {
          dayName: date.toLocaleDateString('it-IT', {
            weekday: 'long',
          }),
          date: date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
          }),
    },
        dateValue: formatDateForInput(date),
      }
    }).filter((day) =>
      schedulePreferences.workingDays.some(
        (workingDay) => DAY_NAME_MAP[workingDay] === day.dayIndex
      )
    )
  }

  function getAppointmentsForDay(dateValue) {
    return appointments
      .filter((appointment) => appointment.date === dateValue)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  function hasOverlap(targetAppointment) {
    return appointments.some((appointment) => {
      if (appointment.appointmentId === targetAppointment.appointmentId) {
        return false
      }

      if (appointment.date !== targetAppointment.date) {
        return false
      }

      return (
        targetAppointment.startTime < appointment.endTime &&
        targetAppointment.endTime > appointment.startTime
      )
    })
  }

  function calculateEndTime(startTime) {
    const duration = schedulePreferences.defaultSessionDuration || 60
    const [hours, minutes] = startTime.split(':').map(Number)

    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes + duration)

    return `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`
  }

  function getTimeFromClick(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickY = event.clientY - rect.top

    const minutesFromStart = Math.round((clickY / HOUR_HEIGHT) * 2) * 30
    const totalMinutes = calendarStartHour * 60 + minutesFromStart

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`
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

    return {
      top: `${
        ((startTotalMinutes - calendarStartMinutes) / 60) * HOUR_HEIGHT
      }px`,
      height: `${
        ((endTotalMinutes - startTotalMinutes) / 60) * HOUR_HEIGHT
      }px`,
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

    return `${((currentMinutes - calendarStartMinutes) / 60) * HOUR_HEIGHT}px`
  }

  function handleCalendarSlotClick(event, day) {
    if (event.target.closest('.calendar-appointment')) {
      return
    }

    const startTime = getTimeFromClick(event)
    const endTime = calculateEndTime(startTime)

    setSelectedAppointment(null)

    setInitialAppointment({
      clientId: '',
      clientName: '',
      date: day.dateValue,
      startTime,
      endTime,
      status: 'scheduled',
      notes: '',
      calendarProvider: null,
      externalCalendarEventId: null,
      syncedToCalendar: false,
    })
  }

  function handleEditAppointment(appointment) {
    setInitialAppointment(null)
    setSelectedAppointment(appointment)
  }

  async function handleAddAppointment(newAppointment) {
    if (hasOverlap(newAppointment)) {
      alert('This appointment overlaps with another appointment.')
      return
    }

    await createAppointment(newAppointment)
    await loadPageData()
    setInitialAppointment(null)
  }

  async function handleUpdateAppointment(updatedAppointment) {
    if (hasOverlap(updatedAppointment)) {
      alert('This appointment overlaps with another appointment.')
      return
    }

    await updateAppointment(updatedAppointment)
    await loadPageData()
    setSelectedAppointment(null)
  }

  async function handleDeleteAppointment() {
        if (!selectedAppointment) {
          return
        }

        const confirmed = window.confirm(
          'Are you sure you want to delete this appointment?'
        )

        if (!confirmed) {
          return
        }

        await deleteAppointment(selectedAppointment.appointmentId)
        await loadPageData()
        setSelectedAppointment(null)
        setInitialAppointment(null)
}

  function handleCancelEdit() {
    setSelectedAppointment(null)
    setInitialAppointment(null)
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

  const startOfWeek = getStartOfWeek(selectedWeekDate)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const weekLabel = `${startOfWeek.toLocaleDateString(
    'it-IT'
  )} - ${endOfWeek.toLocaleDateString('it-IT')}`

  const today = new Date().toLocaleDateString('en-CA')
  const currentTimePosition = getCurrentTimePosition()
  const weekDays = getWeekDays()
  const timeSlotCount = calendarEndHour - calendarStartHour + 1

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Weekly Schedule</h2>
          <p className="week-label">{weekLabel}</p>
        </div>

        <div className="week-navigation">
          <button onClick={goToPreviousWeek}>Previous</button>
          <button onClick={goToCurrentWeek}>Today</button>
          <button onClick={goToNextWeek}>Next</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {(selectedAppointment || initialAppointment) && (
        <div>
          <div className="edit-actions">
            <button className="danger-button" onClick={handleCancelEdit}>
              Cancel Edit
            </button>

            {selectedAppointment && (
              <button className="danger-button" onClick={handleDeleteAppointment}>
                Delete Appointment
              </button>
            )}
          </div>

        <AppointmentForm
            clients={clients}
            selectedAppointment={selectedAppointment}
            initialAppointment={initialAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onAddAppointment={handleAddAppointment}
          />
        </div>
      )}

        <div className="calendar-grid">
          <div className="calendar-time-column">
            <div className="calendar-header-cell"></div>

            {Array.from({ length: timeSlotCount }, (_, index) => {
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
                <div className="calendar-day-header">
                  <span className="calendar-day-name">
                    {day.label.dayName}
                  </span>

                  <span className="calendar-day-date">
                    {day.label.date}
                  </span>
                </div>
                <div
                  className="calendar-day-body"
                  onClick={(event) => handleCalendarSlotClick(event, day)}
                >
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
    </div>
  )
}

export default WeeklySchedulePage