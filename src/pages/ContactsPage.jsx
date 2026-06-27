import { useEffect, useState } from 'react'
import {
  getClients,
  createClient,
} from '../services/clientService'

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contactService'

import ContactForm from '../components/ContactForm'
import ContactCard from '../components/ContactCard'

import useTranslations from '../hooks/useTranslations'

function ContactsPage() {
  const { t } = useTranslations()

  const [contacts, setContacts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [clients, setClients] = useState([])

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
  try {
    setError('')

    const [contactsData, clientsData] = await Promise.all([
      getContacts(),
      getClients(),
    ])

    setContacts(Array.isArray(contactsData) ? contactsData : [])
    setClients(Array.isArray(clientsData) ? clientsData : [])
  } catch (error) {
    console.error(error)
    setError(t('couldNotLoadContacts'))
  }
}

  async function handleAddContact(newContact) {
    try {
      setError('')

      await createContact(newContact)
      await loadContacts()

      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveContact'))
    }
  }

  async function handleUpdateContact(updatedContact) {
    try {
      setError('')

      await updateContact(updatedContact)
      await loadContacts()

      setSelectedContact(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdateContact'))
    }
  }

  async function handleDeleteContact(contactId) {
    const confirmed = window.confirm(
      t('confirmDeleteContact')
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteContact(contactId)
      await loadContacts()
    } catch (error) {
      console.error(error)
      setError(t('couldNotDeleteContact'))
    }
  }

  async function handleConvertContact(contact) {
  const confirmed = window.confirm(t('confirmConvertContact'))

  if (!confirmed) {
    return
  }

  try {
    setError('')

    const newClient = await createClient({
      firstName: contact.firstName,
      lastName: contact.lastName || '',
      phone: contact.phone || '',
      goal: '',
      status: 'active',
    })

    await updateContact({
      ...contact,
      status: 'converted',
      convertedToClientId: newClient.clientId,
      convertedAt: new Date().toISOString(),
    })

    await loadContacts()
  } catch (error) {
    console.error(error)
    setError(t('couldNotConvertContact'))
  }
}

  function hasValidConvertedClient(contact) {
    return clients.some(
      (client) => client.clientId === contact.convertedToClientId
  )
}

  function handleEditContact(contact) {
    setSelectedContact(contact)
    setShowForm(true)
  }

  function handleCancelForm() {
    setSelectedContact(null)
    setShowForm(false)
  }

  const filteredContacts = contacts.filter((contact) => {
    const fullName =
      `${contact.firstName} ${contact.lastName}`.toLowerCase()

    return fullName.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('contacts')}</h2>

      </div>

      <input
        className="search-input"
        type="text"
        placeholder={t('searchContacts')}
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {showForm && (
        <ContactForm
          onAddContact={handleAddContact}
          onUpdateContact={handleUpdateContact}
          selectedContact={selectedContact}
        />
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      <div className="client-list">
        <div className="client-row client-row-header">
          <strong>{t('contact')}</strong>

          <strong>{t('status')}</strong>

          <strong>{t('phone')}</strong>

          <strong>Instagram</strong>

          <div></div>
        </div>

        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.contactId}
            contact={contact}
            isConverted={hasValidConvertedClient(contact)}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onConvertContact={handleConvertContact}
          />
        ))}

                {!showForm && (
          <div
            className="add-package-row"
            onClick={() => setShowForm(true)}
          >
            <span className="add-package-icon">+</span>
            <span>{t('addContact')}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactsPage