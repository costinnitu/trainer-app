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

export async function getExercises() {
  const response = await fetch(`${API_URL}/exercises`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not fetch exercises')
  }

  return response.json()
}

export async function createExercise(exercise) {
  const response = await fetch(`${API_URL}/exercises`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(exercise),
  })

  if (!response.ok) {
    throw new Error('Could not create exercise')
  }

  return response.json()
}

export async function updateExercise(exercise) {
  const response = await fetch(`${API_URL}/exercises/${exercise.exerciseId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(exercise),
  })

  if (!response.ok) {
    throw new Error('Could not update exercise')
  }

  return response.json()
}

export async function deleteExercise(exerciseId) {
  const response = await fetch(`${API_URL}/exercises/${exerciseId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Could not delete exercise')
  }

  return response.json()
}