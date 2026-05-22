import { useState } from 'react'

import {
  Authenticator,
  View,
  Button,
} from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import AppointmentsPage from './pages/AppointmentsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

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

            <div className="navbar-right">
              <button onClick={() => setCurrentPage('dashboard')}>
                Dashboard
              </button>

              <button onClick={() => setCurrentPage('clients')}>
                Clients
              </button>

              <button onClick={() => setCurrentPage('appointments')}>
                Appointments
              </button>

              <Button onClick={signOut}>
                Logout
              </Button>
            </div>
          </nav>

          {currentPage === 'dashboard' && <DashboardPage />}

          {currentPage === 'clients' && <ClientsPage />}

          {currentPage === 'appointments' && <AppointmentsPage />}
        </div>
      )}
    </Authenticator>
  )
}

export default App