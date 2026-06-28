import { useEffect, useState } from 'react'

import useTranslations from '../hooks/useTranslations'

function PackageForm({
  selectedPackage,
  onAddPackage,
  onUpdatePackage,
  onCancel,
}) {
  const { t } = useTranslations()

  const emptyForm = {
    packageName: '',
    totalSessions: 10,
    amount: '',
    notes: '',
  }

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (selectedPackage) {
      setFormData({
        ...emptyForm,
        ...selectedPackage,
      })
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

    const packageData = {
      ...formData,
      totalSessions: Number(formData.totalSessions),
      amount: Number(formData.amount || 0),
    }

    if (selectedPackage) {
      onUpdatePackage(packageData)
    } else {
      onAddPackage(packageData)
    }
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
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
        min="1"
        required
      />

      <input
        type="number"
        name="amount"
        placeholder={t('amount')}
        value={formData.amount}
        onChange={handleChange}
      />

      <input
        name="notes"
        placeholder={t('notes')}
        value={formData.notes}
        onChange={handleChange}
      />

      <div className="form-actions pill-actions">
        <button
          type="button"
          className="add-row-button"
          onClick={onCancel}
        >
          {t('cancel')}
        </button>

        <button
          type="submit"
          className="add-row-button"
        >
          {selectedPackage ? t('update') : t('save')}
        </button>
      </div>
    </form>
  )
}

export default PackageForm