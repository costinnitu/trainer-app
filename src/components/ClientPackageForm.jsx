import { useEffect, useState } from 'react'

import useTranslations from '../hooks/useTranslations'

function ClientPackageForm({
  clients,
  selectedPackage,
  onAddPackage,
  onUpdatePackage,
}) {
  const { t } = useTranslations()

  const emptyForm = {
    clientId: '',
    packageName: '',
    totalSessions: 10,
    remainingSessions: 10,
    amount: '',
    paymentStatus: 'paid',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
}

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (selectedPackage) {
      setFormData(selectedPackage)
    } else {
      setFormData(emptyForm)
    }
  }, [selectedPackage])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const selectedClient = clients.find(
      (client) => client.clientId === formData.clientId
    )

    const packageData = {
  ...formData,
  clientName: selectedClient
    ? `${selectedClient.firstName} ${selectedClient.lastName}`
    : '',
  totalSessions: Number(formData.totalSessions),
  remainingSessions: Number(
    formData.remainingSessions
  ),
  amount: Number(formData.amount),
}

    if (selectedPackage) {
      onUpdatePackage(packageData)
    } else {
      onAddPackage(packageData)
    }
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <select
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        required
      >
        <option value="">
          {t('selectClient')}
        </option>

        {clients.map((client) => (
          <option
            key={client.clientId}
            value={client.clientId}
          >
            {client.firstName} {client.lastName}
          </option>
        ))}
      </select>

      <input
        name="packageName"
        placeholder={t('packageName')}
        value={formData.packageName}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="totalSessions"
        placeholder={t('sessions')}
        value={formData.totalSessions}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="remainingSessions"
        placeholder={t('remainingSessions')}
        value={formData.remainingSessions}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="amount"
        placeholder={t('amount')}
        value={formData.amount}
        onChange={handleChange}
      />

      <select
        name="paymentStatus"
        value={formData.paymentStatus}
        onChange={handleChange}
      >
        <option value="paid">
          {t('paid')}
        </option>

        <option value="unpaid">
          {t('unpaid')}
        </option>
      </select>

      <button type="submit">
        {selectedPackage
          ? t('updatePackage')
          : t('savePackage')}
      </button>
    </form>
  )
}

export default ClientPackageForm