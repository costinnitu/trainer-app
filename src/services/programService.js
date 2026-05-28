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

export async function getPrograms() {
  const response = await fetch(`${API_URL}/programs`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not fetch programs')
  }

  return response.json()
}

export async function createProgram(program) {
  const response = await fetch(`${API_URL}/programs`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(program),
  })

  if (!response.ok) {
    throw new Error('Could not create program')
  }

  return response.json()
}

export async function updateProgram(program) {
  const response = await fetch(`${API_URL}/programs/${program.programId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(program),
  })

  if (!response.ok) {
    throw new Error('Could not update program')
  }

  return response.json()
}

export async function deleteProgram(programId) {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not delete program')
  }

  return response.json()
}