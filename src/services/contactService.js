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

export async function getContacts() {
  const response = await fetch(`${API_URL}/contacts`, {
    headers: await getAuthHeaders(),
  })

  return response.json()
}

export async function createContact(contact) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(contact),
  })

  return response.json()
}

export async function updateContact(contact) {
  const response = await fetch(`${API_URL}/contacts/${contact.contactId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(contact),
  })

  return response.json()
}

export async function deleteContact(contactId) {
  const response = await fetch(`${API_URL}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  return response.json()
}