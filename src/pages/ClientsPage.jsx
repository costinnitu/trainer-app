import { useEffect, useState } from 'react'
import ClientCard from '../components/ClientCard'
import ClientForm from '../components/ClientForm'

import {
  getClients,
  createClient,
  deleteClient,
  updateClient,
} from '../services/clientService'

function ClientsPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    refreshClients()
  }, [])

  async function refreshClients() {
    try {
      setIsLoading(true)
      setError('')

      const data = await getClients()
      setClients([...data])
    } catch (error) {
      console.error(error)
      setError('Could not load clients')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddClient(newClient) {
    await createClient(newClient)
    await refreshClients()
    setShowForm(false)
  }

  async function handleDeleteClient(clientId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this client?'
    )

    if (!confirmed) {
      return
    }

    await deleteClient(clientId)
    await refreshClients()
  }

  function handleEditClient(client) {
    setSelectedClient(client)
    setShowForm(true)
  }

  async function handleUpdateClient(updatedClient) {
    await updateClient(updatedClient)
    await refreshClients()
    setSelectedClient(null)
    setShowForm(false)
  }

  function handleCancelForm() {
    setSelectedClient(null)
    setShowForm(false)
  }

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase()

    return fullName.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="page">
      <div className="page-header">
        <h2>Clients</h2>

        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {showForm && (
        <ClientForm
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          selectedClient={selectedClient}
        />
      )}

      {isLoading && <p>Loading clients...</p>}

      {error && <p className="error-message">{error}</p>}

      <div className="client-grid">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.clientId}
            client={client}
            onDeleteClient={handleDeleteClient}
            onEditClient={handleEditClient}
          />
        ))}
      </div>
    </div>
  )
}

export default ClientsPage