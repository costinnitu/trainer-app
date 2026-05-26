import { useEffect, useState } from 'react'

import {
  getAppPreferences,
  saveAppPreferences,
} from '../services/settingsService'

function AppPreferencesForm() {
  const defaultPreferences = {
    darkMode: false,
  }

  const [preferences, setPreferences] = useState(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      setIsLoading(true)
      setError('')

      const data = await getAppPreferences()

      if (data) {
        setPreferences({
          darkMode: data.darkMode || false,
        })
      }
    } catch (error) {
      console.error(error)
      setError('Could not load app preferences')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDarkModeToggle() {
    const updatedPreferences = {
      darkMode: !preferences.darkMode,
    }
    setPreferences(updatedPreferences)
    localStorage.setItem('darkMode', String(updatedPreferences.darkMode))
    if (updatedPreferences.darkMode) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
}

    try {
      await saveAppPreferences(updatedPreferences)
    } catch (error) {
      console.error(error)
      setError('Could not save app preferences')
    }
  }

  return (
    <div className="client-form">
      {isLoading && <p>Loading app preferences...</p>}

      {error && <p className="error-message">{error}</p>}


      <div className="toggle-row">
        <span>Dark mode</span>

        <button
            type="button"
            className={`toggle-switch ${preferences.darkMode ? 'on' : ''}`}
            onClick={handleDarkModeToggle}
        >
            <span className="toggle-thumb"></span>
        </button>
      </div>
    </div>
  )
}

export default AppPreferencesForm