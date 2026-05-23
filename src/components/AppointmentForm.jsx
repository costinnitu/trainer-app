import { useEffect, useState } from 'react'

function AppointmentForm({
  clients,
  onAddAppointment,
  onUpdateAppointment,
  selectedAppointment,
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

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (selectedAppointment) {
      setFormData(selectedAppointment)
    } else {
      setFormData(emptyForm)
    }
  }, [selectedAppointment])

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