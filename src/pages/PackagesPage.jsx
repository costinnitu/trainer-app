import { useEffect, useState } from 'react'

import { getClients } from '../services/clientService'

import {
  getClientPackages,
  createClientPackage,
  updateClientPackage,
  deleteClientPackage,
} from '../services/clientPackageService'

import ClientPackageForm from '../components/ClientPackageForm'
import ClientPackageCard from '../components/ClientPackageCard'

import useTranslations from '../hooks/useTranslations'

function PackagesPage() {
  const { t } = useTranslations()

  const [clients, setClients] = useState([])
  const [clientPackages, setClientPackages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPackages()
  }, [])

  async function loadPackages() {
    try {
      setError('')

      const [clientsData, packagesData] = await Promise.all([
        getClients(),
        getClientPackages(),
      ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setClientPackages(Array.isArray(packagesData) ? packagesData : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadPackages'))
    }
  }

  async function handleAddPackage(newPackage) {
    try {
      setError('')

      await createClientPackage(newPackage)
      await loadPackages()

      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSavePackage'))
    }
  }

  function handleEditPackage(clientPackage) {
    setSelectedPackage(clientPackage)
    setShowForm(true)
  }

  async function handleUpdatePackage(updatedPackage) {
    try {
      setError('')

      await updateClientPackage(updatedPackage)
      await loadPackages()

      setSelectedPackage(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdatePackage'))
    }
  }

  async function handleDeletePackage(packageId) {
    const confirmed = window.confirm(t('confirmDeletePackage'))

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteClientPackage(packageId)
      await loadPackages()
    } catch (error) {
      console.error(error)
      setError(t('couldNotDeletePackage'))
    }
  }

  function handleCancelForm() {
    setSelectedPackage(null)
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('packages')}</h2>

        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)}>
          {showForm ? t('cancel') : t('addPackage')}
        </button>
      </div>

      {showForm && (
        <ClientPackageForm
          clients={clients}
          selectedPackage={selectedPackage}
          onAddPackage={handleAddPackage}
          onUpdatePackage={handleUpdatePackage}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="client-list">
        <div className="client-row client-row-header">
          <strong>{t('client')}</strong>
          <strong>{t('package')}</strong>
          <strong>{t('sessions')}</strong>
          <strong>{t('amount')}</strong>
          <strong>{t('status')}</strong>
          <div></div>
        </div>

        {clientPackages.length === 0 ? (
          <p>{t('noPackagesYet')}</p>
        ) : (
          clientPackages.map((clientPackage) => (
            <ClientPackageCard
              key={clientPackage.packageId}
              clientPackage={clientPackage}
              onEditPackage={handleEditPackage}
              onDeletePackage={handleDeletePackage}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PackagesPage