function ClientCard({ client, onDeleteClient, onEditClient }) {
  return (
    <div className="client-card">
      <h3>{client.firstName} {client.lastName}</h3>

      <p><strong>Goal:</strong> {client.goal}</p>

      <p>
        <strong>Status:</strong>{' '}
        <span className={`status-badge ${client.status}`}>
          {client.status}
        </span>
      </p>

      <p><strong>Phone:</strong> {client.phone}</p>

      <div className="card-actions">
        <button onClick={() => onEditClient(client)}>
          Edit
        </button>

        <button
          className="danger-button"
          onClick={() => onDeleteClient(client.clientId)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ClientCard