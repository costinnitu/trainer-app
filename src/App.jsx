import { useEffect, useState } from 'react'

import {
  Authenticator,
  Button,
} from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import WeeklySchedulePage from './pages/WeeklySchedulePage'
import ProgramsPage from './pages/ProgramsPage'
import ExerciseLibraryPage from './pages/ExerciseLibraryPage'
import SettingsPage from './pages/SettingsPage'
import PaymentTrackingPage from './pages/PaymentTrackingPage'
import PackagesPage from './pages/PackagesPage'

import { getAppPreferences } from './services/settingsService'
import useTranslations from './hooks/useTranslations'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

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

  function handlePageChange(page) {
    setCurrentPage(page)
    setIsLibraryOpen(false)
  }

  function handleLibraryPageChange(page) {
    setCurrentPage(page)
    setIsLibraryOpen(false)
  }

  const libraryPages = [
    'programs',
    'exerciseLibrary',
    'packages',
    'paymentTracking',
  ]

  const isLibraryActive = libraryPages.includes(currentPage)

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
              <button onClick={() => handlePageChange('dashboard')}>
                {t('dashboard')}
              </button>

              <button onClick={() => handlePageChange('clients')}>
                {t('clients')}
              </button>

              <button onClick={() => handlePageChange('weeklySchedule')}>
                {t('weeklySchedule')}
              </button>

              <div className="nav-group">
                <button
                  type="button"
                  className={`nav-group-button ${
                    isLibraryActive ? 'active' : ''
                  }`}
                  onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                >
                  {t('library')} ▾
                </button>

                {isLibraryOpen && (
                  <div className="nav-submenu">
                    <button
                      type="button"
                      onClick={() => handleLibraryPageChange('programs')}
                    >
                      {t('programs')}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleLibraryPageChange('exerciseLibrary')
                      }
                    >
                      {t('exercises')}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLibraryPageChange('packages')}
                    >
                      {t('packages')}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleLibraryPageChange('paymentTracking')
                      }
                    >
                      {t('paymentTracking')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="navbar-right">
              <button onClick={() => handlePageChange('settings')}>
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


          {currentPage === 'clients' && <ClientsPage />}

          {currentPage === 'programs' && <ProgramsPage />}

          {currentPage === 'paymentTracking' && <PaymentTrackingPage />}

          {currentPage === 'weeklySchedule' && <WeeklySchedulePage />}

          {currentPage === 'packages' && <PackagesPage />}

          {currentPage === 'exerciseLibrary' && <ExerciseLibraryPage />}

          {currentPage === 'settings' && <SettingsPage />}
        </div>
      )}
    </Authenticator>
  )
}

export default App