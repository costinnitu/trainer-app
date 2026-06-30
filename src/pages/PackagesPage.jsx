import { useEffect, useState } from 'react'

import AddRow from '../components/common/AddRow'
import PackageForm from '../components/packages/PackageForm'

import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../services/packageService'

import useTranslations from '../hooks/useTranslations'

function PackagesPage() {
  const { t } = useTranslations()

  const [packages, setPackages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPackages()
  }, [])

  async function loadPackages() {
    try {
      setError('')

      const data = await getPackages()

      setPackages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadPackages'))
    }
  }

  async function handleAddPackage(newPackage) {
    try {
      setError('')

      await createPackage(newPackage)
      await loadPackages()

      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSavePackage'))
    }
  }

  function handleEditPackage(packageTemplate) {
    setSelectedPackage(packageTemplate)
    setShowForm(true)
  }

  async function handleUpdatePackage(updatedPackage) {
    try {
      setError('')

      await updatePackage(updatedPackage)
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

      await deletePackage(packageId)
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
        <h2>{t('packageLibrary')}</h2>
      </div>

      {showForm && (
        <PackageForm
          selectedPackage={selectedPackage}
          onAddPackage={handleAddPackage}
          onUpdatePackage={handleUpdatePackage}
          onCancel={handleCancelForm}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      {!showForm && (
        <>
          {packages.length === 0 ? (
            <p>{t('noPackagesYet')}</p>
          ) : (
            <div className="client-list">
              <div className="package-library-row package-library-row-header">
                <strong>{t('package')}</strong>
                <strong>{t('sessions')}</strong>
                <strong>{t('amount')}</strong>
                <strong>{t('notes')}</strong>
                <div></div>
              </div>

              {packages.map((packageTemplate) => (
                <div
                  key={packageTemplate.packageId}
                  className="package-library-row clickable"
                  onClick={() => handleEditPackage(packageTemplate)}
                >
                  <strong>{packageTemplate.packageName}</strong>
                  <span>{packageTemplate.totalSessions}</span>
                  <span>€{packageTemplate.amount || 0}</span>
                  <span>{packageTemplate.notes || '-'}</span>

                  <button
                    type="button"
                    className="delete-icon-button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDeletePackage(packageTemplate.packageId)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <AddRow
            label={t('addPackage')}
            onClick={() => {
              setSelectedPackage(null)
              setShowForm(true)
            }}
          />
        </>
      )}
    </div>
  )
}

export default PackagesPage