import { useEffect, useState } from 'react'
import AddRow from '../common/AddRow'
import SearchBar from '../common/SearchBar'
import {
  createClient,
} from '../../services/clientService'

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../../services/contactService'

import ContactForm from './ContactForm'
import ContactCard from './ContactCard'

import useTranslations from '../../hooks/useTranslations'

function ContactsSection({ clients = [], onClientsChanged }) {
  const { t } = useTranslations()

  const [contacts, setContacts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      setError('')

      const contactsData = await getContacts()

setContacts(Array.isArray(contactsData) ? contactsData : [])
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
    const confirmed = window.confirm(t('confirmDeleteContact'))

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

      if (onClientsChanged) {
        await onClientsChanged()
      }
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
    setIsExpanded(true)
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
  <div className="contacts-section">
    <div
      className="contacts-toggle-row"
      onClick={() => {
          setIsExpanded(!isExpanded)
          setShowForm(false)
          setSelectedContact(null)
        }}
    >
      <span className="section-arrow">
        {isExpanded ? '▼' : '▶'}
      </span>

      <span>
        {t('contacts')} ({contacts.length})
      </span>
    </div>

    {isExpanded && (
      <div className="section-content">
        <SearchBar
          placeholder={t('searchContacts')}
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {showForm && (
          <ContactForm
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            selectedContact={selectedContact}
            onCancel={handleCancelForm}
          />
        )}

        {error && <p className="error-message">{error}</p>}

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
  <AddRow
  label={t('addContact')}
  onClick={() => {
    setSelectedContact(null)
    setShowForm(true)
  }}
/>
)}
        </div>
      </div>
    )}
  </div>
)
}

export default ContactsSection