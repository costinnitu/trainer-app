import { useEffect, useState } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

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
import { useEffect, useRef, useState } from 'react'

function App() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const lastBackPressRef = useRef(0)
  const { t } = useTranslations()
  const navigate = useNavigate()
  const location = useLocation()

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

  function goTo(path) {
    navigate(path)
    setIsLibraryOpen(false)
    setIsMobileMenuOpen(false)
  }

  const libraryPaths = [
    '/programs',
    '/exercises',
    '/packages',
    '/payments',
  ]

  const isLibraryActive = libraryPaths.includes(location.pathname)

  useEffect(() => {
  function handleBackButton(event) {
    const isOnHomePage = window.location.pathname === '/'

    if (!isOnHomePage) {
      return
    }

    const now = Date.now()

    if (now - lastBackPressRef.current < 2000) {
      return
    }

    event.preventDefault()
    window.history.pushState(null, '', window.location.href)
    lastBackPressRef.current = now

    alert('Press back again to exit')
  }

  window.history.pushState(null, '', window.location.href)
  window.addEventListener('popstate', handleBackButton)

  return () => {
    window.removeEventListener('popstate', handleBackButton)
  }
}, [])

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
              <NavLink to="/">
                {t('dashboard')}
              </NavLink>

              <NavLink to="/clients">
                {t('clients')}
              </NavLink>

              <NavLink to="/schedule">
                {t('weeklySchedule')}
              </NavLink>

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
                    <button type="button" onClick={() => goTo('/programs')}>
                      {t('programs')}
                    </button>

                    <button type="button" onClick={() => goTo('/exercises')}>
                      {t('exercises')}
                    </button>

                    <button type="button" onClick={() => goTo('/packages')}>
                      {t('packages')}
                    </button>

                    <button type="button" onClick={() => goTo('/payments')}>
                      {t('paymentTracking')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="navbar-right">
              <NavLink to="/settings">
                {t('settings')}
              </NavLink>

              <Button onClick={signOut}>
                {t('logout')}
              </Button>
            </div>
          </nav>

          <div className="mobile-bottom-nav">
            <button type="button" onClick={() => goTo('/')}>
              <span>🏠</span>
              <small>{t('dashboard')}</small>
            </button>

            <button type="button" onClick={() => goTo('/clients')}>
              <span>👥</span>
              <small>{t('clients')}</small>
            </button>

            <button type="button" onClick={() => goTo('/schedule')}>
              <span>📅</span>
              <small>{t('weeklySchedule')}</small>
            </button>

            <button type="button" onClick={() => setIsMobileMenuOpen(true)}>
              <span>☰</span>
              <small>More</small>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div
              className="mobile-menu-backdrop"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className="mobile-menu-stack"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="mobile-menu-danger"
                  onClick={signOut}
                >
                  🚪 {t('logout')}
                </button>

                <button type="button" onClick={() => goTo('/programs')}>
                  🏋 {t('programs')}
                </button>

                <button type="button" onClick={() => goTo('/exercises')}>
                  💪 {t('exercises')}
                </button>

                <button type="button" onClick={() => goTo('/packages')}>
                  📦 {t('packages')}
                </button>

                <button type="button" onClick={() => goTo('/payments')}>
                  💳 {t('paymentTracking')}
                </button>

                <button type="button" onClick={() => goTo('/settings')}>
                  ⚙ {t('settings')}
                </button>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/schedule" element={<WeeklySchedulePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/exercises" element={<ExerciseLibraryPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/payments" element={<PaymentTrackingPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </Authenticator>
  )
}

export default App