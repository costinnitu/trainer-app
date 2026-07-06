import { useEffect, useState } from 'react'
import ActionPills from '../common/ActionPills'
import useTranslations from '../../hooks/useTranslations'

function ContactForm({
  onAddContact,
  onUpdateContact,
  selectedContact,
  onCancel,
}) {
  const { t } = useTranslations()

  const emptyContact = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    instagram: '',
    source: '',
    status: 'new',
    notes: '',
  }

  const [contact, setContact] = useState(emptyContact)

  useEffect(() => {
    if (selectedContact) {
      setContact(selectedContact)
    } else {
      setContact(emptyContact)
    }
  }, [selectedContact])

  function handleChange(event) {
    const { name, value } = event.target

    setContact({
      ...contact,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (selectedContact) {
      onUpdateContact(contact)
    } else {
      onAddContact(contact)
    }

    setContact(emptyContact)
  }

  return (
    <form
  className="client-form"
  onSubmit={handleSubmit}
  onClick={(event) => event.stopPropagation()}
>
      <input
        name="firstName"
        placeholder={t('firstName')}
        value={contact.firstName}
        onChange={handleChange}
        required
      />

      <input
        name="lastName"
        placeholder={t('lastName')}
        value={contact.lastName}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder={t('phone')}
        value={contact.phone}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder={t('email')}
        value={contact.email}
        onChange={handleChange}
      />

      <input
        name="instagram"
        placeholder="Instagram"
        value={contact.instagram}
        onChange={handleChange}
      />

      <input
        name="source"
        placeholder={t('source')}
        value={contact.source}
        onChange={handleChange}
      />

      <select
        name="status"
        value={contact.status}
        onChange={handleChange}
      >
        <option value="new">{t('new')}</option>
        <option value="contacted">{t('contacted')}</option>
        <option value="interested">{t('interested')}</option>
        <option value="notInterested">{t('notInterested')}</option>
        <option value="converted">{t('converted')}</option>
      </select>

      <input
        name="notes"
        placeholder={t('notes')}
        value={contact.notes}
        onChange={handleChange}
      />

      <ActionPills
  onCancel={(event) => {
    event.stopPropagation()
    onCancel()
  }}
  cancelLabel={t('cancel')}
  saveLabel={selectedContact ? t('update') : t('save')}
/>
    </form>
  )
}

export default ContactForm