import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = import.meta.env.VITE_API_URL

async function getAuthHeaders() {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()

  return {
    'Content-Type': 'application/json',
    Authorization: token,
  }
}

export async function getPayments() {
  const response = await fetch(`${API_URL}/payments`, {
    headers: await getAuthHeaders(),
  })

  return response.json()
}

export async function createPayment(payment) {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(payment),
  })

  return response.json()
}

export async function updatePayment(payment) {
  const response = await fetch(
    `${API_URL}/payments/${payment.paymentId}`,
    {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(payment),
    }
  )

  return response.json()
}

export async function deletePayment(paymentId) {
  const response = await fetch(
    `${API_URL}/payments/${paymentId}`,
    {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    }
  )

  return response.json()
}