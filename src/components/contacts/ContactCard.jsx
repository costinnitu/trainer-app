import useTranslations from '../../hooks/useTranslations'
import { FaWhatsapp } from 'react-icons/fa'

function ContactCard({
  contact,
  isConverted,
  onEditContact,
  onDeleteContact,
  onConvertContact,
}) {
  const { t } = useTranslations()

  function getTranslatedStatus(status) {
    switch (status) {
      case 'new':
        return t('new')

      case 'contacted':
        return t('contacted')

      case 'interested':
        return t('interested')

      case 'notInterested':
        return t('notInterested')

      case 'converted':
        return t('converted')

      default:
        return status
    }
  }

  function openWhatsApp(event) {
    event.stopPropagation()

    if (!contact.phone) {
      return
    }

    const cleanedPhone = contact.phone.replace(/\s+/g, '')

    window.open(`https://wa.me/${cleanedPhone}`, '_blank')
  }

  function openInstagram(event) {
    event.stopPropagation()

    if (!contact.instagram) {
      return
    }

    const username = contact.instagram.replace('@', '')

    window.open(`https://instagram.com/${username}`, '_blank')
  }

  function handleConvert(event) {
    event.stopPropagation()
    onConvertContact(contact)
  }

  return (
    <div
      className="client-row contact-row clickable"
      onClick={() => onEditContact(contact)}
    >
      <div>
        <strong>
          {contact.firstName} {contact.lastName}
        </strong>
      </div>

      <span className={`status-badge ${contact.status}`}>
        {getTranslatedStatus(contact.status)}
      </span>

      <span>{contact.phone || '-'}</span>

      <span>{contact.instagram || '-'}</span>

      <div className="contact-actions">
  {contact.phone && (
    <>
      <button
        type="button"
        className="contact-action-button desktop-only"
        onClick={openWhatsApp}
      >
        WhatsApp
      </button>

      <button
  type="button"
  className="contact-action-button mobile-only"
  onClick={openWhatsApp}
>
  <FaWhatsapp />
</button>
    </>
  )}

  {contact.instagram && (
    <button
      type="button"
      className="contact-action-button desktop-only"
      onClick={openInstagram}
    >
      Instagram
    </button>
  )}

  {!isConverted && (
    <button
      type="button"
      className="contact-action-button convert-button"
      onClick={handleConvert}
    >
      {t('convert')}
    </button>
  )}

  <button
    className="delete-icon-button desktop-only"
    onClick={(event) => {
      event.stopPropagation()
      onDeleteContact(contact.contactId)
    }}
  >
    ×
  </button>
</div>
    </div>
  )
}

export default ContactCard