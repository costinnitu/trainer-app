import { useEffect, useState } from 'react'

import useTranslations from '../hooks/useTranslations'

function ClientForm({
  onAddClient,
  onUpdateClient,
  selectedClient,
}) {
  const { t } = useTranslations()

  const emptyForm = {
    firstName: '',
    lastName: '',
    phone: '',
    goal: '',
    status: 'active',
  }

  const [formData, setFormData] =
    useState(emptyForm)

  useEffect(() => {
    if (selectedClient) {
      setFormData(selectedClient)
    } else {
      setFormData(emptyForm)
    }
  }, [selectedClient])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (selectedClient) {
      onUpdateClient(formData)
    } else {
      const newClient = {
        clientId: crypto.randomUUID(),
        ...formData,
      }

      onAddClient(newClient)
    }

    setFormData(emptyForm)
  }

  return (
    <form
      className="client-form"
      onSubmit={handleSubmit}
    >
      <input
        name="firstName"
        placeholder={t('firstName')}
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <input
        name="lastName"
        placeholder={t('lastName')}
        value={formData.lastName}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder={t('phone')}
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        name="goal"
        placeholder={t('goal')}
        value={formData.goal}
        onChange={handleChange}
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="active">
          {t('active')}
        </option>

        <option value="paused">
          {t('paused')}
        </option>

        <option value="inactive">
          {t('inactive')}
        </option>
      </select>

      <button type="submit">
        {selectedClient
          ? t('updateClient')
          : t('saveClient')}
      </button>
    </form>
  )
}

export default ClientForm