import { useEffect, useState } from 'react'

import {
  getAppPreferences,
  saveAppPreferences,
} from '../services/settingsService'

import useTranslations from '../hooks/useTranslations'

function AppPreferencesForm() {
  const defaultPreferences = {
    darkMode: false,
    language: 'en',
  }

  const [preferences, setPreferences] = useState(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { t } = useTranslations()

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
          language: data.language || 'en',
        })
      }
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadAppPreferences'))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLanguageChange(event) {
    const updatedPreferences = {
      ...preferences,
      language: event.target.value,
    }

    setPreferences(updatedPreferences)

    localStorage.setItem(
      'language',
      updatedPreferences.language
    )

    try {
      await saveAppPreferences(updatedPreferences)

      alert(t('languageSaved'))
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveLanguage'))
    }
  }

  async function handleDarkModeToggle() {
    const updatedPreferences = {
      ...preferences,
      darkMode: !preferences.darkMode,
    }

    setPreferences(updatedPreferences)

    localStorage.setItem(
      'darkMode',
      String(updatedPreferences.darkMode)
    )

    if (updatedPreferences.darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }

    try {
      await saveAppPreferences(updatedPreferences)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveAppPreferences'))
    }
  }

  return (
    <div className="client-form">
      {isLoading && (
        <p>{t('loadingAppPreferences')}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      <div className="toggle-row">
        <span>{t('darkMode')}</span>

        <button
          type="button"
          className={`toggle-switch ${
            preferences.darkMode ? 'on' : ''
          }`}
          onClick={handleDarkModeToggle}
        >
          <span className="toggle-thumb"></span>
        </button>
      </div>

      <div className="exercise-input-group">
        <label>{t('language')}</label>

        <select
          value={preferences.language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="it">Italiano</option>
        </select>
      </div>
    </div>
  )
}

export default AppPreferencesForm