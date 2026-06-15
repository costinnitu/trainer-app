import { useEffect, useState } from 'react'

import {
  getTrainerProfile,
  saveTrainerProfile,
} from '../services/settingsService'

import useTranslations from '../hooks/useTranslations'

function TrainerProfileForm() {
  const { t } = useTranslations()

  const emptyProfile = {
    trainerName: '',
    businessName: '',
    email: '',
    phone: '',
  }

  const [profile, setProfile] = useState(emptyProfile)
  const [savedProfile, setSavedProfile] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setIsLoading(true)
      setError('')

      const data = await getTrainerProfile()

      if (data) {
        setProfile({
          trainerName: data.trainerName || '',
          businessName: data.businessName || '',
          email: data.email || '',
          phone: data.phone || '',
        })

        setSavedProfile(data)
        setShowForm(false)
      } else {
        setShowForm(true)
      }
    } catch (error) {
      console.error(error)
      setError(t('couldNotLoadTrainerProfile'))
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setProfile({
      ...profile,
      [name]: value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsLoading(true)
      setError('')

      const saved = await saveTrainerProfile(profile)

      setSavedProfile(saved)
      setShowForm(false)
    } catch (error) {
      console.error(error)
      setError(t('couldNotSaveTrainerProfile'))
    } finally {
      setIsLoading(false)
    }
  }

  function handleEditProfile() {
    setShowForm(true)
  }

  return (
    <div>
      {isLoading && (
        <p>{t('loadingProfile')}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {showForm && (
        <form className="client-form" onSubmit={handleSubmit}>
          <input
            name="trainerName"
            placeholder={t('trainerName')}
            value={profile.trainerName}
            onChange={handleChange}
          />

          <input
            name="businessName"
            placeholder={t('businessName')}
            value={profile.businessName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder={t('email')}
            value={profile.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder={t('phone')}
            value={profile.phone}
            onChange={handleChange}
          />

          <button type="submit">
            {savedProfile
              ? t('updateProfile')
              : t('saveProfile')}
          </button>
        </form>
      )}

      {savedProfile && !showForm && (
        <div className="profile-summary">
          {savedProfile.businessName && (
            <h4>{savedProfile.businessName}</h4>
          )}

          {savedProfile.trainerName && (
            <p>
              <strong>{t('trainer')}:</strong>{' '}
              {savedProfile.trainerName}
            </p>
          )}

          {savedProfile.email && (
            <p>
              <strong>{t('email')}:</strong>{' '}
              {savedProfile.email}
            </p>
          )}

          {savedProfile.phone && (
            <p>
              <strong>{t('phone')}:</strong>{' '}
              {savedProfile.phone}
            </p>
          )}

          <button onClick={handleEditProfile}>
            {t('edit')}
          </button>
        </div>
      )}
    </div>
  )
}

export default TrainerProfileForm