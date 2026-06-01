import { useEffect, useState } from 'react'

import ClientCard from '../components/ClientCard'
import ClientForm from '../components/ClientForm'

import {
  getClients,
  createClient,
  deleteClient,
  updateClient,
} from '../services/clientService'

import useTranslations from '../hooks/useTranslations'

function ClientsPage() {
  const { t } = useTranslations()

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
      setClients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadClients'))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddClient(newClient) {
    try {
      setError('')

      await createClient(newClient)
      await refreshClients()
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveClient'))
    }
  }

  async function handleDeleteClient(clientId) {
    const confirmed = window.confirm(t('confirmDeleteClient'))

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteClient(clientId)
      await refreshClients()
    } catch (error) {
      console.error(error)
      setError(t('couldNotDeleteClient'))
    }
  }

  function handleEditClient(client) {
    setSelectedClient(client)
    setShowForm(true)
  }

  async function handleUpdateClient(updatedClient) {
    try {
      setError('')

      await updateClient(updatedClient)
      await refreshClients()
      setSelectedClient(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdateClient'))
    }
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
        <h2>{t('clients')}</h2>

        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
          {showForm ? t('cancel') : t('addClient')}
        </button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder={t('searchClients')}
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

      {isLoading && <p>{t('loadingClients')}</p>}

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