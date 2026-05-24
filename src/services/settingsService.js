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

export async function getTrainerProfile() {
  const response = await fetch(`${API_URL}/settings/profile`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not fetch trainer profile')
  }

  return response.json()
}

export async function saveTrainerProfile(profile) {
  const response = await fetch(`${API_URL}/settings/profile`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    throw new Error('Could not save trainer profile')
  }

  return response.json()
}