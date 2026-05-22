import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = 'https://z1i4gxvme7.execute-api.eu-south-1.amazonaws.com'

async function getAuthHeaders() {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()

  return {
    'Content-Type': 'application/json',
    Authorization: token,
  }
}

export async function getAppointments() {
  const response = await fetch(`${API_URL}/appointments`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not fetch appointments')
  }

  return response.json()
}

export async function createAppointment(appointment) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(appointment),
  })

  if (!response.ok) {
    throw new Error('Could not create appointment')
  }

  return response.json()
}

export async function updateAppointment(appointment) {
  const response = await fetch(
    `${API_URL}/appointments/${appointment.appointmentId}`,
    {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(appointment),
    }
  )

  if (!response.ok) {
    throw new Error('Could not update appointment')
  }

  return response.json()
}

export async function deleteAppointment(appointmentId) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not delete appointment')
  }

  return response.json()
}