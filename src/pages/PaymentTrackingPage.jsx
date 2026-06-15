import { useEffect, useState } from 'react'

import { getClients } from '../services/clientService'
import { getAppointments } from '../services/appointmentService'
import { getPrograms } from '../services/programService'
import { getClientPrograms } from '../services/clientProgramService'
import {
  getClientPackages,
  updateClientPackage,
} from '../services/clientPackageService'

import {
  getPayments,
  createPayment,
  updatePayment,
} from '../services/paymentService'

import useTranslations from '../hooks/useTranslations'

function PaymentTrackingPage() {
  const { t, language } = useTranslations()

  const [clients, setClients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [programs, setPrograms] = useState([])
  const [clientPrograms, setClientPrograms] = useState([])
  const [clientPackages, setClientPackages] = useState([])
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')

  const locale = language === 'it' ? 'it-IT' : 'en-US'

  useEffect(() => {
    loadPaymentData()
  }, [])


  async function syncPackagePaymentStatus(item, status) {
  if (item.itemType !== 'package') {
    return
  }

  const linkedPackage = clientPackages.find(
    (clientPackage) => clientPackage.packageId === item.itemId
  )

  if (!linkedPackage) {
    return
  }

  await updateClientPackage({
    ...linkedPackage,
    paymentStatus: status,
  })
}

  async function loadPaymentData() {
    try {
      setError('')

      const [
        clientsData,
        appointmentsData,
        programsData,
        clientProgramsData,
        packagesData,
        paymentsData,
      ] = await Promise.all([
        getClients(),
        getAppointments(),
        getPrograms(),
        getClientPrograms(),
        getClientPackages(),
        getPayments(),
      ])

      setClients(Array.isArray(clientsData) ? clientsData : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
      setPrograms(Array.isArray(programsData) ? programsData : [])
      setClientPrograms(
        Array.isArray(clientProgramsData) ? clientProgramsData : []
      )
      setClientPackages(Array.isArray(packagesData) ? packagesData : [])
      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadPayments'))
    }
  }

  function getClientName(clientId) {
    const client = clients.find((client) => client.clientId === clientId)

    if (!client) {
      return '-'
    }

    return `${client.firstName} ${client.lastName}`
  }

  function getProgramName(programId) {
    const program = programs.find((program) => program.programId === programId)

    return program?.programName || '-'
  }

  function getPaymentForItem(itemType, itemId) {
    return payments.find(
      (payment) =>
        payment.itemType === itemType &&
        payment.itemId === itemId
    )
  }

  function getBillableItems() {
   const packageItems = clientPackages.map((clientPackage) => ({
  itemType: 'package',
  itemId: clientPackage.packageId,
  clientId: clientPackage.clientId,
  clientName:
    clientPackage.clientName || getClientName(clientPackage.clientId),
  description: clientPackage.packageName,
  amount: Number(clientPackage.amount || 0),
  date: clientPackage.purchaseDate || clientPackage.createdAt,
  paymentStatus: clientPackage.paymentStatus || 'unpaid',
}))

    const standaloneAppointmentItems = appointments
      .filter((appointment) => !appointment.packageId)
      .map((appointment) => ({
        itemType: 'appointment',
        itemId: appointment.appointmentId,
        clientId: appointment.clientId,
        clientName:
          appointment.clientName || getClientName(appointment.clientId),
        description: `${t('appointment')} - ${new Date(
          appointment.date
        ).toLocaleDateString(locale)} ${appointment.startTime}`,
        amount: 0,
        date: appointment.date,
      }))

    const programItems = clientPrograms.map((assignment) => ({
      itemType: 'program',
      itemId: assignment.assignmentId,
      clientId: assignment.clientId,
      clientName: getClientName(assignment.clientId),
      description: getProgramName(assignment.programId),
      amount: 0,
      date: assignment.assignedAt,
    }))

    return [
      ...packageItems,
      ...standaloneAppointmentItems,
      ...programItems,
    ].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      return dateB - dateA
    })
  }

  async function handleMarkPaid(item) {
    try {
      setError('')

      const existingPayment = getPaymentForItem(item.itemType, item.itemId)

      if (existingPayment) {
        await updatePayment({
          ...existingPayment,
          amount: item.amount || existingPayment.amount || 0,
          status: 'paid',
          paidAt: new Date().toISOString(),
        })
      } else {
        await createPayment({
          clientId: item.clientId,
          clientName: item.clientName,
          itemType: item.itemType,
          itemId: item.itemId,
          description: item.description,
          amount: item.amount || 0,
          status: 'paid',
          paidAt: new Date().toISOString(),
          method: 'other',
          notes: '',
        })
      }

      await syncPackagePaymentStatus(item, 'paid')
      await loadPaymentData()
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdatePayment'))
    }
  }

  async function handleMarkUnpaid(item) {
    try {
      setError('')

      const existingPayment = getPaymentForItem(item.itemType, item.itemId)

      if (existingPayment) {
        await updatePayment({
          ...existingPayment,
          amount: item.amount || existingPayment.amount || 0,
          status: 'unpaid',
          paidAt: null,
        })
      } else {
        await createPayment({
          clientId: item.clientId,
          clientName: item.clientName,
          itemType: item.itemType,
          itemId: item.itemId,
          description: item.description,
          amount: item.amount || 0,
          status: 'unpaid',
          paidAt: null,
          method: 'other',
          notes: '',
        })
      }

      await syncPackagePaymentStatus(item, 'unpaid')
      await loadPaymentData()
    } catch (error) {
      console.error(error)
      setError(t('couldNotUpdatePayment'))
    }
  }

  function getTranslatedItemType(itemType) {
    switch (itemType) {
      case 'package':
        return t('package')

      case 'appointment':
        return t('appointment')

      case 'program':
        return t('program')

      default:
        return itemType
    }
  }

  const billableItems = getBillableItems()

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('paymentTracking')}</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="client-list">
        <div className="payment-row payment-row-header">
          <strong>{t('client')}</strong>
          <strong>{t('type')}</strong>
          <strong>{t('description')}</strong>
          <strong>{t('amount')}</strong>
          <strong>{t('status')}</strong>
        </div>

        {billableItems.length === 0 ? (
          <p>{t('noBillableItems')}</p>
        ) : (
          billableItems.map((item) => {
            const payment = getPaymentForItem(item.itemType, item.itemId)
            const status = payment?.status || item.paymentStatus || 'unpaid'
            const amount = payment?.amount ?? item.amount ?? 0

            return (
              <div
                className="payment-row"
                key={`${item.itemType}-${item.itemId}`}
              >
                <strong>{item.clientName}</strong>

                <span>{getTranslatedItemType(item.itemType)}</span>

                <span>{item.description}</span>

                <span>€{amount}</span>

                <button
  type="button"
  className={`payment-status-toggle ${status}`}
  onClick={() =>
    status === 'paid'
      ? handleMarkUnpaid(item)
      : handleMarkPaid(item)
  }
>
  <span>{status === 'paid' ? t('paid') : t('unpaid')}</span>
</button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default PaymentTrackingPage