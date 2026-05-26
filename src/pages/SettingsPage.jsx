import TrainerProfileForm from '../components/TrainerProfileForm'
import SchedulePreferencesForm from '../components/SchedulePreferencesForm'
import AppPreferencesForm from '../components/AppPreferencesForm'

function SettingsPage() {
  return (
    <div className="page">
      <h2>Settings</h2>

      <div className="settings-card">
        <h3>Trainer Profile</h3>
        <TrainerProfileForm />
      </div>

      <div className="settings-card">
        <h3>Schedule Preferences</h3>
        <SchedulePreferencesForm />
      </div>

      <div className="settings-card">
        <h3>App Preferences</h3>
        <AppPreferencesForm />
      </div>
      
    </div>
  )
}

export default SettingsPage