import { useEffect, useState } from 'react'

import {
  getSchedulePreferences,
  saveSchedulePreferences,
} from '../services/settingsService'

import useTranslations from '../hooks/useTranslations'

function SchedulePreferencesForm() {
  const { t } = useTranslations()

  const defaultPreferences = {
    workingDays: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ],
    workStartTime: '07:00',
    workEndTime: '20:00',
    defaultSessionDuration: 60,
  }

  const [preferences, setPreferences] =
    useState(defaultPreferences)

  const [savedPreferences, setSavedPreferences] =
    useState(null)

  const [showForm, setShowForm] =
    useState(false)

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] = useState('')

  const days = [
    {
      value: 'monday',
      label: t('monday'),
    },
    {
      value: 'tuesday',
      label: t('tuesday'),
    },
    {
      value: 'wednesday',
      label: t('wednesday'),
    },
    {
      value: 'thursday',
      label: t('thursday'),
    },
    {
      value: 'friday',
      label: t('friday'),
    },
    {
      value: 'saturday',
      label: t('saturday'),
    },
    {
      value: 'sunday',
      label: t('sunday'),
    },
  ]

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      setIsLoading(true)
      setError('')

      const data =
        await getSchedulePreferences()

      if (data) {
        const loadedPreferences = {
          workingDays:
            data.workingDays ||
            defaultPreferences.workingDays,

          workStartTime:
            data.workStartTime ||
            defaultPreferences.workStartTime,

          workEndTime:
            data.workEndTime ||
            defaultPreferences.workEndTime,

          defaultSessionDuration:
            data.defaultSessionDuration ||
            defaultPreferences.defaultSessionDuration,
        }

        setPreferences(loadedPreferences)
        setSavedPreferences(
          loadedPreferences
        )

        setShowForm(false)
      } else {
        setShowForm(true)
      }
    } catch (error) {
      console.error(error)

      setError(
        t(
          'couldNotLoadSchedulePreferences'
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleDayToggle(dayValue) {
    const isSelected =
      preferences.workingDays.includes(
        dayValue
      )

    const updatedDays = isSelected
      ? preferences.workingDays.filter(
          (day) => day !== dayValue
        )
      : [
          ...preferences.workingDays,
          dayValue,
        ]

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
        name ===
        'defaultSessionDuration'
          ? Number(value)
          : value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      preferences.workEndTime <=
      preferences.workStartTime
    ) {
      alert(
        t('invalidWorkingHours')
      )

      return
    }

    try {
      setIsLoading(true)
      setError('')

      const saved =
        await saveSchedulePreferences(
          preferences
        )

      setSavedPreferences(saved)
      setShowForm(false)
    } catch (error) {
      console.error(error)

      setError(
        t(
          'couldNotSaveSchedulePreferences'
        )
      )
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
        const day = days.find(
          (item) =>
            item.value === dayValue
        )

        return day
          ? day.label
          : dayValue
      })
      .join(', ')
  }

  return (
    <div>
      {isLoading && (
        <p>
          {t(
            'loadingSchedulePreferences'
          )}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {showForm && (
        <form
          className="client-form"
          onSubmit={handleSubmit}
        >
          <div className="checkbox-group">
            {days.map((day) => (
              <label
                key={day.value}
                className="checkbox-label"
              >
                <input
                  type="checkbox"
                  checked={preferences.workingDays.includes(
                    day.value
                  )}
                  onChange={() =>
                    handleDayToggle(
                      day.value
                    )
                  }
                />

                {day.label}
              </label>
            ))}
          </div>

          <input
            type="time"
            name="workStartTime"
            value={
              preferences.workStartTime
            }
            onChange={handleChange}
          />

          <input
            type="time"
            name="workEndTime"
            value={
              preferences.workEndTime
            }
            onChange={handleChange}
          />

          <input
            type="number"
            name="defaultSessionDuration"
            placeholder={t(
              'defaultSessionDuration'
            )}
            value={
              preferences.defaultSessionDuration
            }
            onChange={handleChange}
            min="15"
            step="15"
          />

          <button type="submit">
            {savedPreferences
              ? t(
                  'updateSchedulePreferences'
                )
              : t(
                  'saveSchedulePreferences'
                )}
          </button>
        </form>
      )}

      {savedPreferences &&
        !showForm && (
          <div className="profile-summary">
            <h4>
              {t(
                'schedulePreferences'
              )}
            </h4>

            <p>
              <strong>
                {t(
                  'workingDays'
                )}
                :
              </strong>{' '}
              {formatWorkingDays(
                savedPreferences.workingDays
              )}
            </p>

            <p>
              <strong>
                {t(
                  'workingHours'
                )}
                :
              </strong>{' '}
              {
                savedPreferences.workStartTime
              }{' '}
              -{' '}
              {
                savedPreferences.workEndTime
              }
            </p>

            <p>
              <strong>
                {t(
                  'defaultSessionDuration'
                )}
                :
              </strong>{' '}
              {
                savedPreferences.defaultSessionDuration
              }{' '}
              {t('minutes')}
            </p>

            <button
              onClick={
                handleEditPreferences
              }
            >
              {t(
                'edit'
              )}
            </button>
          </div>
        )}
    </div>
  )
}

export default SchedulePreferencesForm