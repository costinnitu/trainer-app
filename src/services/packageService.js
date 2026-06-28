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

export async function getPackages() {
  const response = await fetch(`${API_URL}/packages`, {
    headers: await getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.message || `Load failed: ${response.status}`)
  }

  return data
}

export async function createPackage(packageTemplate) {
  const response = await fetch(`${API_URL}/packages`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(packageTemplate),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.message || `Create failed: ${response.status}`)
  }

  return data
}

export async function updatePackage(packageTemplate) {
  const response = await fetch(
    `${API_URL}/packages/${packageTemplate.packageId}`,
    {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(packageTemplate),
    }
  )

  return response.json()
}

export async function deletePackage(packageId) {
  const response = await fetch(`${API_URL}/packages/${packageId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  return response.json()
}