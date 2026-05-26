import { useEffect, useState } from 'react'

import {
  getSchedulePreferences,
  saveSchedulePreferences,
} from '../services/settingsService'

function SchedulePreferencesForm() {
  const defaultPreferences = {
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workStartTime: '07:00',
    workEndTime: '20:00',
    defaultSessionDuration: 60,
  }

  const [preferences, setPreferences] = useState(defaultPreferences)
  const [savedPreferences, setSavedPreferences] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ]

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      setIsLoading(true)
      setError('')

      const data = await getSchedulePreferences()

      if (data) {
        const loadedPreferences = {
          workingDays: data.workingDays || defaultPreferences.workingDays,
          workStartTime: data.workStartTime || defaultPreferences.workStartTime,
          workEndTime: data.workEndTime || defaultPreferences.workEndTime,
          defaultSessionDuration:
            data.defaultSessionDuration ||
            defaultPreferences.defaultSessionDuration,
        }

        setPreferences(loadedPreferences)
        setSavedPreferences(loadedPreferences)
        setShowForm(false)
      }
    } catch (error) {
      console.error(error)
      setError('Could not load schedule preferences')
    } finally {
      setIsLoading(false)
    }
  }

  function handleDayToggle(dayValue) {
    const isSelected = preferences.workingDays.includes(dayValue)

    const updatedDays = isSelected
      ? preferences.workingDays.filter((day) => day !== dayValue)
      : [...preferences.workingDays, dayValue]

    setPreferences({
      ...preferences,
      workingDays: updatedDays,
    })
  }

  function handleChange(event) {
    const { name, value } = event.target

    setPreferences({
      ...preferences,
      [name]:
        name === 'defaultSessionDuration'
          ? Number(value)
          : value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (preferences.workEndTime <= preferences.workStartTime) {
      alert('Work end time must be after work start time.')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const saved = await saveSchedulePreferences(preferences)

      setSavedPreferences(saved)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError('Could not save schedule preferences')
    } finally {
      setIsLoading(false)
    }
  }

  function handleEditPreferences() {
    setShowForm(true)
  }

  function formatWorkingDays(daysList) {
    return daysList
      .map((dayValue) => {
        const day = days.find((item) => item.value === dayValue)
        return day ? day.label : dayValue
      })
      .join(', ')
  }

  return (
    <div>
      {isLoading && <p>Loading schedule preferences...</p>}

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="client-form" onSubmit={handleSubmit}>
          <div className="checkbox-group">
            {days.map((day) => (
              <label key={day.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.workingDays.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                />
                {day.label}
              </label>
            ))}
          </div>

          <input
            type="time"
            name="workStartTime"
            value={preferences.workStartTime}
            onChange={handleChange}
          />

          <input
            type="time"
            name="workEndTime"
            value={preferences.workEndTime}
            onChange={handleChange}
          />

          <input
            type="number"
            name="defaultSessionDuration"
            placeholder="Default session duration"
            value={preferences.defaultSessionDuration}
            onChange={handleChange}
            min="15"
            step="15"
          />

          <button type="submit">
            {savedPreferences
              ? 'Update Schedule Preferences'
              : 'Save Schedule Preferences'}
          </button>
        </form>
      )}

      {savedPreferences && !showForm && (
        <div className="profile-summary">
          <h4>Schedule Preferences</h4>

          <p>
            <strong>Working days:</strong>{' '}
            {formatWorkingDays(savedPreferences.workingDays)}
          </p>

          <p>
            <strong>Working hours:</strong>{' '}
            {savedPreferences.workStartTime} - {savedPreferences.workEndTime}
          </p>

          <p>
            <strong>Default session duration:</strong>{' '}
            {savedPreferences.defaultSessionDuration} minutes
          </p>

          <button onClick={handleEditPreferences}>
            Edit Schedule Preferences
          </button>
        </div>
      )}
    </div>
  )
}

export default SchedulePreferencesForm