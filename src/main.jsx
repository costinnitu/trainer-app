import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Amplify } from 'aws-amplify'

import App from './App'
import './index.css'

import amplifyConfig from './amplify-config'

Amplify.configure(amplifyConfig)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)