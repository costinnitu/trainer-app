import TrainerProfileForm from "../components/settings/TrainerProfileForm";
import SchedulePreferencesForm from "../components/settings/SchedulePreferencesForm";
import AppPreferencesForm from "../components/settings/AppPreferencesForm";
import ClientStatusPreferencesForm from "../components/settings/ClientStatusPreferencesForm";
import useTranslations from '../hooks/useTranslations'

function SettingsPage() {
  const { t } = useTranslations()

  return (
    <div className="page">
      <h2>{t('settings')}</h2>

      <div className="settings-card">
        <h3>{t('trainerProfile')}</h3>
        <TrainerProfileForm />
      </div>

      <div className="settings-card">
        <h3>{t('schedulePreferences')}</h3>
        <SchedulePreferencesForm />
      </div>

      <div className="settings-card">
         <h3>{t('clientStatusPreferences')}</h3>

        <ClientStatusPreferencesForm />
      </div>

      <div className="settings-card">
        <h3>{t('appPreferences')}</h3>
        <AppPreferencesForm />
      </div>
    </div>
  )
}

export default SettingsPage