import TrainerProfileForm from '../components/TrainerProfileForm'

function SettingsPage() {
  return (
    <div className="page">
      <h2>Settings</h2>

      <div className="settings-card">
        <h3>Trainer Profile</h3>
        <TrainerProfileForm />
      </div>

      <div className="settings-card">
        <h3>Calendar Settings</h3>

        <p>Future Google Calendar integration settings will go here.</p>
      </div>

      <div className="settings-card">
        <h3>App Preferences</h3>

        <p>Default working hours and scheduling preferences will go here.</p>
      </div>
    </div>
  )
}

export default SettingsPage