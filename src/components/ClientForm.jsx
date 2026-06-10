import { useEffect, useState } from 'react'

import useTranslations from '../hooks/useTranslations'

function ClientForm({
  programs,
  clientPackages,
  selectedProgramIds,
  onAddClient,
  onUpdateClient,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  selectedClient,
}) {
  const { t } = useTranslations()

  const emptyForm = {
    firstName: '',
    lastName: '',
    phone: '',
    goal: '',
    status: 'active',
    assignedProgramIds: [],
  }

  const emptyPackageForm = {
    packageName: '',
    totalSessions: 10,
    remainingSessions: 10,
    amount: '',
    paymentStatus: 'paid',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  }

  const [formData, setFormData] = useState(emptyForm)
  const [packageForm, setPackageForm] = useState(emptyPackageForm)
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        ...selectedClient,
        assignedProgramIds: selectedProgramIds || [],
      })
    } else {
      setFormData(emptyForm)
    }

    setPackageForm(emptyPackageForm)
    setSelectedPackage(null)
  }, [selectedClient, selectedProgramIds])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handlePackageChange(event) {
    const { name, value } = event.target

    setPackageForm({
      ...packageForm,
      [name]: value,
    })
  }

  function handleProgramToggle(programId) {
    const isSelected = formData.assignedProgramIds.includes(programId)

    const updatedProgramIds = isSelected
      ? formData.assignedProgramIds.filter((id) => id !== programId)
      : [...formData.assignedProgramIds, programId]

    setFormData({
      ...formData,
      assignedProgramIds: updatedProgramIds,
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

  function handlePackageSubmit(event) {
    event.preventDefault()

    const packageData = {
      ...packageForm,
      clientId: selectedClient.clientId,
      clientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
      totalSessions: Number(packageForm.totalSessions),
      remainingSessions: Number(packageForm.remainingSessions),
      amount: Number(packageForm.amount || 0),
    }

    if (selectedPackage) {
      onUpdatePackage({
        ...selectedPackage,
        ...packageData,
      })
    } else {
      onAddPackage(packageData)
    }

    setPackageForm(emptyPackageForm)
    setSelectedPackage(null)
  }

  function handleEditPackage(clientPackage) {
    setSelectedPackage(clientPackage)

    setPackageForm({
      packageName: clientPackage.packageName || '',
      totalSessions: clientPackage.totalSessions || 10,
      remainingSessions: clientPackage.remainingSessions || 0,
      amount: clientPackage.amount || '',
      paymentStatus: clientPackage.paymentStatus || 'paid',
      purchaseDate:
        clientPackage.purchaseDate ||
        new Date().toISOString().split('T')[0],
      notes: clientPackage.notes || '',
    })
  }

  function handleCancelPackageEdit() {
    setSelectedPackage(null)
    setPackageForm(emptyPackageForm)
  }

  return (
    <div>
      <form className="client-form" onSubmit={handleSubmit}>
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
          <option value="active">{t('active')}</option>
          <option value="paused">{t('paused')}</option>
          <option value="inactive">{t('inactive')}</option>
        </select>

        <div className="exercise-input-group">
          <label>{t('assignedPrograms')}</label>

          {programs.length === 0 ? (
            <p>{t('noProgramsYet')}</p>
          ) : (
            <div className="program-chip-selector">
              {programs.map((program) => {
                const isSelected =
                  formData.assignedProgramIds.includes(program.programId)

                return (
                  <button
                    type="button"
                    key={program.programId}
                    className={`program-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleProgramToggle(program.programId)}
                  >
                    {program.programName}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button type="submit">
          {selectedClient ? t('updateClient') : t('saveClient')}
        </button>
      </form>

      {selectedClient && (
        <div className="client-package-section">
          <h3>{t('packages')}</h3>

          {clientPackages.length === 0 ? (
            <p>{t('noPackagesYet')}</p>
          ) : (
            <div className="client-package-list">
              {clientPackages.map((clientPackage) => (
                <div
                  className="client-package-row clickable"
                  key={clientPackage.packageId}
                  onClick={() => handleEditPackage(clientPackage)}
                >
                  <strong>{clientPackage.packageName}</strong>

                  <span>
                    {clientPackage.remainingSessions}/
                    {clientPackage.totalSessions}
                  </span>

                  <span>€{clientPackage.amount || 0}</span>

                  <span className={`status-badge ${clientPackage.paymentStatus}`}>
                    {clientPackage.paymentStatus === 'paid'
                      ? t('paid')
                      : t('unpaid')}
                  </span>

                  <button
                    type="button"
                    className="delete-icon-button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDeletePackage(clientPackage.packageId)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <form className="client-form" onSubmit={handlePackageSubmit}>
            <input
              name="packageName"
              placeholder={t('packageName')}
              value={packageForm.packageName}
              onChange={handlePackageChange}
              required
            />

            <input
              type="number"
              name="totalSessions"
              placeholder={t('sessions')}
              value={packageForm.totalSessions}
              onChange={handlePackageChange}
              required
            />

            <input
              type="number"
              name="remainingSessions"
              placeholder={t('remainingSessions')}
              value={packageForm.remainingSessions}
              onChange={handlePackageChange}
              required
            />

            <input
              type="number"
              name="amount"
              placeholder={t('amount')}
              value={packageForm.amount}
              onChange={handlePackageChange}
            />

            <select
              name="paymentStatus"
              value={packageForm.paymentStatus}
              onChange={handlePackageChange}
            >
              <option value="paid">{t('paid')}</option>
              <option value="unpaid">{t('unpaid')}</option>
            </select>

            <button type="submit">
              {selectedPackage ? t('updatePackage') : t('savePackage')}
            </button>

            {selectedPackage && (
              <button
                type="button"
                onClick={handleCancelPackageEdit}
              >
                {t('cancel')}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

export default ClientForm