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

export async function getClientPrograms() {
  const response = await fetch(`${API_URL}/client-programs`, {
    headers: await getAuthHeaders(),
  })

  return response.json()
}

export async function assignProgramToClient(assignment) {
  const response = await fetch(`${API_URL}/client-programs`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(assignment),
  })

  return response.json()
}

export async function removeProgramAssignment(assignmentId) {
  const response = await fetch(
    `${API_URL}/client-programs/${assignmentId}`,
    {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    }
  )

  return response.json()
}