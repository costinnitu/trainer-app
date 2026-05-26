import { useEffect, useState } from 'react'
import { getSchedulePreferences } from '../services/settingsService'

function AppointmentForm({
  clients,
  onAddAppointment,
  onUpdateAppointment,
  selectedAppointment,
  initialAppointment,
}) {
  const emptyForm = {
    clientId: '',
    clientName: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'scheduled',
    notes: '',

    calendarProvider: null,
    externalCalendarEventId: null,
    syncedToCalendar: false,
  }

  const [defaultSessionDuration, setDefaultSessionDuration] = useState(60)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
  loadSchedulePreferences()
}, [])

async function loadSchedulePreferences() {
  try {
    const data = await getSchedulePreferences()

    if (data?.defaultSessionDuration) {
      setDefaultSessionDuration(data.defaultSessionDuration)
    }
  } catch (error) {
    console.error(error)
  }
}

  useEffect(() => {
  if (selectedAppointment) {
    setFormData(selectedAppointment)
  } else if (initialAppointment) {
    setFormData({
      ...emptyForm,
      ...initialAppointment,
    })
  } else {
    setFormData(emptyForm)
  }
}, [selectedAppointment, initialAppointment])

  function calculateEndTime(startTime) {
  const [hours, minutes] = startTime.split(':').map(Number)

  const startDate = new Date()
  startDate.setHours(hours)
  startDate.setMinutes(minutes + defaultSessionDuration)

  const endHours = String(startDate.getHours()).padStart(2, '0')
  const endMinutes = String(startDate.getMinutes()).padStart(2, '0')

  return `${endHours}:${endMinutes}`
}

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'clientId') {
      const selectedClient = clients.find(
        (client) => client.clientId === value
      )

      setFormData({
        ...formData,
        clientId: value,
        clientName: selectedClient
          ? `${selectedClient.firstName} ${selectedClient.lastName}`
          : '',
      })

      return
    }

    if (name === 'startTime' && !selectedAppointment) {
  setFormData({
    ...formData,
    startTime: value,
    endTime: calculateEndTime(value),
  })

  return
}

    setFormData({
      ...formData,
      [name]: value,
    })
  }

function handleSubmit(event) {
  event.preventDefault()

  if (formData.endTime <= formData.startTime) {
    alert('End time must be after start time.')
    return
  }

  const today = new Date().toLocaleDateString('en-CA')

  if (formData.date < today) {
    alert('Appointment date cannot be in the past.')
    return
  }

  if (selectedAppointment) {
    onUpdateAppointment(formData)
  } else {
    onAddAppointment(formData)
  }

  setFormData(emptyForm)
}

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <select
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        required
      >
        <option value="">Select client</option>

        {clients.map((client) => (
          <option key={client.clientId} value={client.clientId}>
            {client.firstName} {client.lastName}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        required
      />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
      />

      <button type="submit">
        {selectedAppointment ? 'Update Appointment' : 'Save Appointment'}
      </button>
    </form>
  )
}

export default AppointmentForm