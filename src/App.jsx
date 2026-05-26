import { useEffect, useState } from 'react'

import {
  Authenticator,
  View,
  Button,
} from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import WeeklySchedulePage from './pages/WeeklySchedulePage'
import SettingsPage from './pages/SettingsPage'
import { getAppPreferences } from './services/settingsService'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

useEffect(() => {
  loadAppPreferences()
}, [])

const savedTheme = localStorage.getItem('darkMode')

    if (savedTheme === 'true') {
     document.body.classList.add('dark-mode')
}

async function loadAppPreferences() {
  try {
    const preferences = await getAppPreferences()

    const isDarkMode = preferences?.darkMode || false

    setDarkMode(isDarkMode)
    localStorage.setItem('darkMode', String(isDarkMode))

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
               Welcome {user?.signInDetails?.loginId}
             </strong>
           </div>

          <div className="navbar-center">
            <button onClick={() => setCurrentPage('dashboard')}>
              Dashboard
            </button>

            <button onClick={() => setCurrentPage('clients')}>
              Clients
            </button>

            <button onClick={() => setCurrentPage('weeklySchedule')}>
              Weekly Schedule
            </button>
          </div>

          <div className="navbar-right">
            <button onClick={() => setCurrentPage('settings')}>
              Settings
            </button>
            <Button onClick={signOut}>
              Logout
            </Button>
          </div>
         </nav>

          {currentPage === 'dashboard' && <DashboardPage />}

          {currentPage === 'clients' && <ClientsPage />}

          {currentPage === 'weeklySchedule' && <WeeklySchedulePage />}

          {currentPage === 'settings' && <SettingsPage />}
        </div>
      )}
    </Authenticator>
  )
}

export default App