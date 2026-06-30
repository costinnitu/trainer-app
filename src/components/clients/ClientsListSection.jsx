import ClientCard from './ClientCard'
import AddRow from '../common/AddRow'
import useTranslations from '../../hooks/useTranslations'

function ClientsListSection({
  clients,
  getComputedClientStatus,
  getClientPaymentHealth,
  getActivePackage,
  getAssignedPrograms,
  onDeleteClient,
  onEditClient,
  onAddClient,
}) {
  const { t } = useTranslations()

  return (
    <div className="client-list">
      <div className="client-row client-row-header">
        <strong>{t('client')}</strong>
        <strong>WhatsApp</strong>
        <strong>{t('activePackage')}</strong>
        <strong>{t('assignedPrograms')}</strong>
        <strong>{t('payments')}</strong>
        <div></div>
      </div>

      {clients.map((client) => (
        <ClientCard
          key={client.clientId}
          client={{
            ...client,
            status: getComputedClientStatus(client),
          }}
          paymentHealth={getClientPaymentHealth(client.clientId)}
          activePackage={getActivePackage(client.clientId)}
          assignedPrograms={getAssignedPrograms(client.clientId)}
          onDeleteClient={onDeleteClient}
          onEditClient={onEditClient}
        />
      ))}

      <AddRow
        label={t('addClient')}
        onClick={onAddClient}
      />
    </div>
  )
}

export default ClientsListSection