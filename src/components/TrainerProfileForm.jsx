import { useState } from 'react'

function TrainerProfileForm() {
  const [profile, setProfile] = useState({
    trainerName: '',
    businessName: '',
    email: '',
    phone: '',
  })

  const [savedProfile, setSavedProfile] = useState(null)
  const [showForm, setShowForm] = useState(true)

  function handleChange(event) {
    const { name, value } = event.target

    setProfile({
      ...profile,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    setSavedProfile(profile)
    setShowForm(false)
  }

  function handleEditProfile() {
    setShowForm(true)
  }

  return (
    <div>
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

          <button type="submit">Save Profile</button>
        </form>
      )}

      {savedProfile && (
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