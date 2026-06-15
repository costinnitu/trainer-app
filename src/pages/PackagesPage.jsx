import { useEffect, useState } from 'react'

import { getClients } from '../services/clientService'

import {
  getClientPackages,
  createClientPackage,
  updateClientPackage,
  deleteClientPackage,
} from '../services/clientPackageService'

import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '../services/paymentService'

import ClientPackageForm from '../components/ClientPackageForm'
import ClientPackageCard from '../components/ClientPackageCard'

import useTranslations from '../hooks/useTranslations'

function PackagesPage() {
  const { t } = useTranslations()

  const [clients, setClients] = useState([])
  const [clientPackages, setClientPackages] = useState([])
  const [payments, setPayments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPackages()
  }, [])

  async function loadPackages() {
    try {
      setError('')

      const [clientsData, packagesData, paymentsData] = await Promise.all([
        getClients(),
        getClientPackages(),
        getPayments(),
      ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setClientPackages(Array.isArray(packagesData) ? packagesData : [])
      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadPackages'))
    }
  }

  function getPaymentForPackage(packageId) {
    return payments.find(
      (payment) =>
        payment.itemType === 'package' &&
        payment.itemId === packageId
    )
  }

  async function upsertPackagePayment(clientPackage) {
    const freshPayments = await getPayments()

    const existingPayment = freshPayments.find(
      (payment) =>
        payment.itemType === 'package' &&
        payment.itemId === clientPackage.packageId
    )

    const paymentStatus = clientPackage.paymentStatus || 'unpaid'

    const payload = {
      clientId: clientPackage.clientId,
      clientName: clientPackage.clientName,
      itemType: 'package',
      itemId: clientPackage.packageId,
      description: clientPackage.packageName,
      amount: Number(clientPackage.amount || 0),
      status: paymentStatus,
      paidAt:
        paymentStatus === 'paid'
          ? existingPayment?.paidAt || new Date().toISOString()
          : null,
      method: existingPayment?.method || 'other',
      notes: clientPackage.notes || '',
    }

    if (existingPayment) {
      await updatePayment({
        ...existingPayment,
        ...payload,
      })
    } else {
      await createPayment(payload)
    }
  }

  async function handleAddPackage(newPackage) {
    try {
      setError('')

      const savedPackage = await createClientPackage(newPackage)

      await upsertPackagePayment({
        ...newPackage,
        ...savedPackage,
        paymentStatus:
          newPackage.paymentStatus ||
          savedPackage.paymentStatus ||
          'unpaid',
      })

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

      const savedPackage = await updateClientPackage(updatedPackage)

      await upsertPackagePayment({
        ...updatedPackage,
        ...savedPackage,
        paymentStatus:
          updatedPackage.paymentStatus ||
          savedPackage.paymentStatus ||
          'unpaid',
      })

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

      const existingPayment = getPaymentForPackage(packageId)

      if (existingPayment) {
        await deletePayment(existingPayment.paymentId)
      }

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
          <strong>{t('sessionStatus')}</strong>
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