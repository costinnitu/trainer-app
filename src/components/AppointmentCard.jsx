function AppointmentCard({
  appointment,
  onDeleteAppointment,
  onEditAppointment,
}) {
  const formattedDate = new Date(
    appointment.date
  ).toLocaleDateString('it-IT')

  return (
    <div className="client-card">
      <h3>{appointment.clientName}</h3>

      <p><strong>Date:</strong> {formattedDate}</p>

      <p>
        <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
      </p>

      <p>
        <strong>Status:</strong>{' '}
        <span className={`status-badge ${appointment.status}`}>
          {appointment.status}
        </span>
      </p>

      <p><strong>Notes:</strong> {appointment.notes}</p>

      <div className="card-actions">
        <button onClick={() => onEditAppointment(appointment)}>
          Edit
        </button>

        <button
          className="danger-button"
          onClick={() => onDeleteAppointment(appointment.appointmentId)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default AppointmentCard