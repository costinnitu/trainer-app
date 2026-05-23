import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = import.meta.env.VITE_API_URL

async function getAuthHeaders() {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()

  return {
    'Content-Type': 'application/json',
     Authorization: token,  }
}

export async function getClients() {
  const response = await fetch(`${API_URL}/clients`, {
  headers: await getAuthHeaders(),
})

  return response.json()
}

export async function createClient(client) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(client),
  })

  return response.json()
}

export async function updateClient(client) {
  const response = await fetch(`${API_URL}/clients/${client.clientId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(client),
  })

  return response.json()
}

export async function deleteClient(clientId) {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  return response.json()
}