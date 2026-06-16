import { useEffect, useState } from 'react'

import {
  getAppPreferences,
  saveAppPreferences,
} from '../services/settingsService'

import useTranslations from '../hooks/useTranslations'

function AppPreferencesForm() {
  const { t } = useTranslations()

  const defaultPreferences = {
    darkMode: false,
    language: 'en',
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

    localStorage.setItem('language', updatedPreferences.language)

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
      setError(t('couldNotSaveAppPreferences'))
    }
  }

  return (
    <div className="profile-summary">
      {isLoading && <p>{t('loadingAppPreferences')}</p>}

      {error && <p className="error-message">{error}</p>}

      <div className="settings-row">
        <span>{t('darkMode')}</span>

        <div className="settings-control">
          <button
            type="button"
            className={`toggle-switch ${preferences.darkMode ? 'on' : ''}`}
            onClick={handleDarkModeToggle}
          >
            <span className="toggle-thumb"></span>
          </button>
        </div>
      </div>

      <div className="settings-row">
        <span>{t('language')}</span>

        <div className="language-selector">
          <button
            type="button"
            className={`language-option ${
              preferences.language === 'en' ? 'active' : ''
            }`}
            onClick={() =>
              handleLanguageChange({
                target: { value: 'en' },
              })
            }
          >
            <img
              src="https://flagcdn.com/w40/gb.png"
              alt="English"
              className="language-flag"
            />

            English
          </button>

          <button
            type="button"
            className={`language-option ${
              preferences.language === 'it' ? 'active' : ''
            }`}
            onClick={() =>
              handleLanguageChange({
                target: { value: 'it' },
              })
            }
          >
            <img
              src="https://flagcdn.com/w40/it.png"
              alt="Italiano"
              className="language-flag"
            />

            Italiano
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppPreferencesForm