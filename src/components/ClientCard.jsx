import useTranslations from '../hooks/useTranslations'

function ClientCard({
  client,
  onDeleteClient,
  onEditClient,
}) {
  const { t } = useTranslations()

  function getTranslatedStatus(status) {
    switch (status) {
      case 'active':
        return t('active')

      case 'paused':
        return t('paused')

      case 'inactive':
        return t('inactive')

      default:
        return status
    }
  }

  return (
    <div className="client-card">
      <h3>
        {client.firstName}{' '}
        {client.lastName}
      </h3>

      {client.goal && (
        <p>
          <strong>{t('goal')}:</strong>{' '}
          {client.goal}
        </p>
      )}

      <p>
        <strong>{t('status')}:</strong>{' '}
        <span
          className={`status-badge ${client.status}`}
        >
          {getTranslatedStatus(
            client.status
          )}
        </span>
      </p>

      {client.phone && (
        <p>
          <strong>{t('phone')}:</strong>{' '}
          {client.phone}
        </p>
      )}

      <div className="card-actions">
        <button
          onClick={() =>
            onEditClient(client)
          }
        >
          {t('edit')}
        </button>

        <button
          className="danger-button"
          onClick={() =>
            onDeleteClient(
              client.clientId
            )
          }
        >
          {t('delete')}
        </button>
      </div>
    </div>
  )
}

export default ClientCard