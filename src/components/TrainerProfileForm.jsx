import { useEffect, useState } from 'react'

import {
  getTrainerProfile,
  saveTrainerProfile,
} from '../services/settingsService'

function TrainerProfileForm() {
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
      }
      else {
          setShowForm(true)
      }

    } catch (error) {
      console.error(error)
      setError('Could not load trainer profile')
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
      setError('Could not save trainer profile')
    } finally {
      setIsLoading(false)
    }
  }

  function handleEditProfile() {
    setShowForm(true)
  }

  return (
    <div>
      {isLoading && <p>Loading profile...</p>}

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="client-form" onSubmit={handleSubmit}>
          <input
            name="trainerName"
            placeholder="Trainer name"
            value={profile.trainerName}
            onChange={handleChange}
          />

          <input
            name="businessName"
            placeholder="Business name"
            value={profile.businessName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={profile.phone}
            onChange={handleChange}
          />

          <button type="submit">
            {savedProfile ? 'Update Profile' : 'Save Profile'}
          </button>
        </form>
      )}

      {savedProfile && !showForm && (
        <div className="profile-summary">
          <h4>{savedProfile.businessName}</h4>

          <p>
            <strong>Trainer:</strong> {savedProfile.trainerName}
          </p>

          <p>
            <strong>Email:</strong> {savedProfile.email}
          </p>

          <p>
            <strong>Phone:</strong> {savedProfile.phone}
          </p>

          <button onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default TrainerProfileForm