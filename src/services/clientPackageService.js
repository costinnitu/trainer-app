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

export async function getClientPackages() {
  const response = await fetch(`${API_URL}/client-packages`, {
    headers: await getAuthHeaders(),
  })

  return response.json()
}

export async function createClientPackage(clientPackage) {
  const response = await fetch(`${API_URL}/client-packages`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(clientPackage),
  })

  return response.json()
}

export async function updateClientPackage(clientPackage) {
  const response = await fetch(
    `${API_URL}/client-packages/${clientPackage.packageId}`,
    {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(clientPackage),
    }
  )

  return response.json()
}

export async function deleteClientPackage(packageId) {
  const response = await fetch(`${API_URL}/client-packages/${packageId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  return response.json()
}