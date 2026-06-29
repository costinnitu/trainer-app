import { useEffect, useState } from 'react'

import {
  getClientStatusPreferences,
  saveClientStatusPreferences,
} from '../../services/settingsService'

import useTranslations from '../../hooks/useTranslations'

function ClientStatusPreferencesForm() {
  const { t } = useTranslations()

  const defaultPreferences = {
    enableAutoStatus: true,
    autoPauseAfterDays: 30,
  }

  const [preferences, setPreferences] = useState(defaultPreferences)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      setIsLoading(true)
      setError('')

      const data = await getClientStatusPreferences()

      if (data) {
        setPreferences({
          enableAutoStatus: data.enableAutoStatus ?? true,
          autoPauseAfterDays: data.autoPauseAfterDays || 30,
        })
      }
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadClientStatusPreferences'))
    } finally {
      setIsLoading(false)
    }
  }

  function handleToggle() {
    setPreferences({
      ...preferences,
      enableAutoStatus: !preferences.enableAutoStatus,
    })
  }

  function handleChange(event) {
    setPreferences({
      ...preferences,
      autoPauseAfterDays: Number(event.target.value),
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsLoading(true)
      setError('')

      await saveClientStatusPreferences(preferences)

      setIsEditing(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveClientStatusPreferences'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <div
  className="profile-summary clickable-summary"
  onClick={() => setIsEditing(true)}
>
        <p>
          <strong>{t('enableAutoClientStatus')}:</strong>{' '}
          {preferences.enableAutoStatus ? t('yes') : t('no')}
        </p>

        <p>
          <strong>{t('autoPauseAfterDays')}:</strong>{' '}
          {preferences.autoPauseAfterDays}
        </p>

      </div>
    )
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      {isLoading && <p>{t('loadingClientStatusPreferences')}</p>}

      {error && <p className="error-message">{error}</p>}

      <div className="settings-row">
        <span>{t('enableAutoClientStatus')}</span>

        <div className="settings-control">
          <button
            type="button"
            className={`toggle-switch ${
              preferences.enableAutoStatus ? 'on' : ''
            }`}
            onClick={handleToggle}
          >
            <span className="toggle-thumb"></span>
          </button>
        </div>
      </div>

      <div className="exercise-input-group">
        <label>{t('autoPauseAfterDays')}</label>

        <input
          type="number"
          min="1"
          step="1"
          value={preferences.autoPauseAfterDays}
          onChange={handleChange}
        />
      </div>

      <div className="add-row">
  <button
    type="submit"
    className="add-row-button"
  >
    {t('update')}
  </button>
</div>
    </form>
  )
}

export default ClientStatusPreferencesForm