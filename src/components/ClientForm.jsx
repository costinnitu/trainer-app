import { useEffect, useState } from 'react'

import useTranslations from '../hooks/useTranslations'

function ClientForm({
  programs,
  selectedProgramIds,
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
    assignedProgramIds: [],
  }

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        ...selectedClient,
        assignedProgramIds: selectedProgramIds || [],
      })
    } else {
      setFormData(emptyForm)
    }
  }, [selectedClient, selectedProgramIds])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
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

      <div className="exercise-input-group">
  <label>{t('assignedPrograms')}</label>

  {programs.length === 0 ? (
    <p>{t('noProgramsYet')}</p>
  ) : (
    <div className="program-chip-selector">
      {programs.map((program) => {
        const isSelected = formData.assignedProgramIds.includes(
          program.programId
        )

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
  )
}

export default ClientForm