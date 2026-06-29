import { useEffect, useState } from 'react'
import ClientPackagesSection from './clients/ClientPackagesSection'
import useTranslations from '../hooks/useTranslations'
import ActionPills from './common/ActionPills'
import ClientDetailsSection from './clients/ClientDetailsSection'
import ClientProgramsSection from './clients/ClientProgramsSection'

function ClientForm({
  programs,
  packageLibrary,
  payments,
  clientPackages,
  selectedProgramIds,
  onAddClient,
  onUpdateClient,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  selectedClient,
  onCancel,
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

  const [formData, setFormData] = useState(emptyForm)
  const [activeSection, setActiveSection] = useState(
    selectedClient ? null : 'details'
  )

  const [showProgramSelector, setShowProgramSelector] = useState(false)
  const [programSearchTerm, setProgramSearchTerm] = useState('')

  const [showPackageSelector, setShowPackageSelector] = useState(false)
  const [packageSearchTerm, setPackageSearchTerm] = useState('')

  useEffect(() => {
  if (selectedClient) {
    setFormData({
      ...selectedClient,
      assignedProgramIds: selectedProgramIds || [],
    })

    setActiveSection(null)
  } else {
    setFormData(emptyForm)
    setActiveSection('details')
  }

  setShowProgramSelector(false)
  setProgramSearchTerm('')
  setShowPackageSelector(false)
  setPackageSearchTerm('')
}, [selectedClient?.clientId])

  function getPackagePaymentStatus(packageId) {
    const payment = payments?.find(
      (payment) =>
        payment.itemType === 'package' &&
        payment.itemId === packageId
    )

    return payment?.status || 'unpaid'
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleProgramToggle(programId) {
    const isSelected = formData.assignedProgramIds.includes(programId)

    setFormData({
      ...formData,
      assignedProgramIds: isSelected
        ? formData.assignedProgramIds.filter((id) => id !== programId)
        : [...formData.assignedProgramIds, programId],
    })
  }

  async function handleAssignPackage(packageTemplate) {
  const clientPackage = {
    clientId: selectedClient.clientId,
    clientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
    packageName: packageTemplate.packageName,
    totalSessions: Number(packageTemplate.totalSessions || 0),
    remainingSessions: Number(packageTemplate.totalSessions || 0),
    amount: Number(packageTemplate.amount || 0),
    paymentStatus: 'unpaid',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: packageTemplate.notes || '',
  }

  await onAddPackage(clientPackage)

  setShowPackageSelector(false)
  setPackageSearchTerm('')
  setActiveSection('packages')
}

  function handleSubmit(event) {
    event.preventDefault()

    if (selectedClient) {
      onUpdateClient(formData)
      setActiveSection(null)
    } else {
      onAddClient({
        clientId: crypto.randomUUID(),
        ...formData,
      })

      setFormData(emptyForm)
    }
  }

  function getSelectedProgramNames() {
    return programs
      .filter((program) =>
        formData.assignedProgramIds.includes(program.programId)
      )
      .map((program) => program.programName)
      .join(', ')
  }

  function toggleSection(sectionName) {
    if (activeSection === sectionName) {
      setActiveSection(null)
    } else {
      setActiveSection(sectionName)
    }
  }

  const filteredPrograms = programs.filter((program) =>
    program.programName
      ?.toLowerCase()
      .includes(programSearchTerm.toLowerCase())
  )

  const filteredPackages = (packageLibrary || []).filter((packageTemplate) =>
    packageTemplate.packageName
      ?.toLowerCase()
      .includes(packageSearchTerm.toLowerCase())
  )

  if (!selectedClient) {
    return (
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
            {t('save')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div>
      <ClientDetailsSection
  formData={formData}
  activeSection={activeSection}
  onToggleSection={toggleSection}
  onChange={handleChange}
  onSubmit={handleSubmit}
  onCancelEdit={() => setActiveSection(null)}
/>

      <ClientProgramsSection
  activeSection={activeSection}
  toggleSection={toggleSection}
  selectedProgramNames={getSelectedProgramNames()}
  onCloseSection={() => setActiveSection(null)}
  onOpenProgramSelector={() => setShowProgramSelector(true)}
/>

      <ClientPackagesSection
  clientPackages={clientPackages}
  getPackagePaymentStatus={getPackagePaymentStatus}
  onUpdatePackage={onUpdatePackage}
  onDeletePackage={onDeletePackage}
  onOpenPackageSelector={() => setShowPackageSelector(true)}
/>

      {showProgramSelector && (
        <div
          className="modal-backdrop"
          onClick={() => setShowProgramSelector(false)}
        >
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{t('assignedPrograms')}</h3>

            <input
              className="search-input"
              type="text"
              placeholder={t('searchPrograms')}
              value={programSearchTerm}
              onChange={(event) =>
                setProgramSearchTerm(event.target.value)
              }
            />

            <div className="client-list">
              {filteredPrograms.map((program) => {
                const isSelected =
                  formData.assignedProgramIds.includes(program.programId)

                return (
                  <div
                    key={program.programId}
                    className="client-row clickable"
                    onClick={() => handleProgramToggle(program.programId)}
                  >
                    <strong>{program.programName}</strong>
                    <span>{program.goal || '-'}</span>
                    <span>
                      {program.durationWeeks
                        ? `${program.durationWeeks} ${t('weeks')}`
                        : '-'}
                    </span>
                    <span
                      className={`status-badge ${
                        isSelected ? 'paid' : 'inactive'
                      }`}
                    >
                      {isSelected ? t('active') : t('inactive')}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="form-actions pill-actions">
              <button
                type="button"
                className="add-row-button"
                onClick={() => setShowProgramSelector(false)}
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                className="add-row-button"
                onClick={() => setShowProgramSelector(false)}
              >
                {t('update')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPackageSelector && (
        <div
          className="modal-backdrop"
          onClick={() => setShowPackageSelector(false)}
        >
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{t('packages')}</h3>

            <input
              className="search-input"
              type="text"
              placeholder={t('searchPackages')}
              value={packageSearchTerm}
              onChange={(event) =>
                setPackageSearchTerm(event.target.value)
              }
            />

            <div className="client-list">
              {filteredPackages.map((packageTemplate) => (
                <div
                  key={packageTemplate.packageId}
                  className="client-row clickable"
                  onClick={() => handleAssignPackage(packageTemplate)}
                >
                  <strong>{packageTemplate.packageName}</strong>

                  <span>
                    {packageTemplate.totalSessions} {t('sessions')}
                  </span>

                  <span>€{packageTemplate.amount || 0}</span>

                  <span>{packageTemplate.notes || '-'}</span>
                </div>
              ))}
            </div>

            <div className="form-actions pill-actions">
              <button
                type="button"
                className="add-row-button"
                onClick={() => setShowPackageSelector(false)}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ActionPills
  onCancel={onCancel}
  onSave={() => {
    onUpdateClient(formData)
    onCancel()
  }}
  cancelLabel={t('cancel')}
  saveLabel={t('update')}
/>
    </div>
  )
}

export default ClientForm