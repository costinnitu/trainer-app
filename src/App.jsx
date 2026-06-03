import { useEffect, useState } from 'react'

import {
  Authenticator,
  Button,
} from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import DashboardPage from './pages/DashboardPage'
import ContactsPage from './pages/ContactsPage'
import ClientsPage from './pages/ClientsPage'
import WeeklySchedulePage from './pages/WeeklySchedulePage'
import ProgramsPage from './pages/ProgramsPage'
import ExerciseLibraryPage from './pages/ExerciseLibraryPage'
import SettingsPage from './pages/SettingsPage'
import PaymentTrackingPage from './pages/PaymentTrackingPage'
import { getAppPreferences } from './services/settingsService'
import useTranslations from './hooks/useTranslations'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { t } = useTranslations()

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')

    if (savedTheme === 'true') {
      document.body.classList.add('dark-mode')
    }

    loadAppPreferences()
  }, [])

  async function loadAppPreferences() {
    try {
      const preferences = await getAppPreferences()

      const isDarkMode = preferences?.darkMode || false
      const language = preferences?.language || 'en'

      localStorage.setItem('darkMode', String(isDarkMode))
      localStorage.setItem('language', language)

      if (isDarkMode) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <nav className="navbar">
            <div className="navbar-left">
              <strong>
                {t('welcome')} {user?.signInDetails?.loginId}
              </strong>
            </div>

            <div className="navbar-center">
              <button onClick={() => setCurrentPage('dashboard')}>
                {t('dashboard')}
              </button>

              <button onClick={() => setCurrentPage('contacts')}>
                {t('contacts')}
              </button>

              <button onClick={() => setCurrentPage('clients')}>
                {t('clients')}
              </button>

              <button onClick={() => setCurrentPage('weeklySchedule')}>
                {t('weeklySchedule')}
              </button>

              <button onClick={() => setCurrentPage('programs')}>
                {t('programs')}
              </button>

              <button onClick={() => setCurrentPage('paymentTracking')}>
                {t('paymentTracking')}
              </button>

              <button onClick={() => setCurrentPage('exerciseLibrary')}>
                {t('exercises')}
              </button>
            </div>

            <div className="navbar-right">
              <button onClick={() => setCurrentPage('settings')}>
                {t('settings')}
              </button>

              <Button onClick={signOut}>
                {t('logout')}
              </Button>
            </div>
          </nav>

          {currentPage === 'dashboard' && (
  <DashboardPage setCurrentPage={setCurrentPage} />
  )}

          {currentPage === 'contacts' && <ContactsPage />}

          {currentPage === 'clients' && <ClientsPage />}

          {currentPage === 'programs' && <ProgramsPage />}

          {currentPage === 'paymentTracking' && <PaymentTrackingPage />}

          {currentPage === 'weeklySchedule' && <WeeklySchedulePage />}

          {currentPage === 'exerciseLibrary' && <ExerciseLibraryPage />}

          {currentPage === 'settings' && <SettingsPage />}
        </div>
      )}
    </Authenticator>
  )
}

export default App