import { useEffect, useState } from 'react'
import ClientPackagesSection from './ClientPackagesSection'
import useTranslations from '../../hooks/useTranslations'
import ActionPills from '../common/ActionPills'
import ClientDetailsSection from './ClientDetailsSection'
import ClientProgramsSection from './ClientProgramsSection'
import ProgramSelectorModal from './ProgramSelectorModal'
import PackageSelectorModal from './PackageSelectorModal'

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
    email: '',
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
    <ClientDetailsSection
      formData={formData}
      activeSection="details"
      onToggleSection={() => {}}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancelEdit={onCancel}
      saveLabel={t('save')}
    />
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
  <ProgramSelectorModal
    programSearchTerm={programSearchTerm}
    onSearchChange={setProgramSearchTerm}
    filteredPrograms={filteredPrograms}
    assignedProgramIds={formData.assignedProgramIds}
    onToggleProgram={handleProgramToggle}
    onClose={() => setShowProgramSelector(false)}
  />
)}

      {showPackageSelector && (
  <PackageSelectorModal
    packageSearchTerm={packageSearchTerm}
    onSearchChange={setPackageSearchTerm}
    filteredPackages={filteredPackages}
    onAssignPackage={handleAssignPackage}
    onClose={() => setShowPackageSelector(false)}
  />
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