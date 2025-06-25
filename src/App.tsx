import React from 'react'

import { Web3Provider } from '../web3provider'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

import './style.css'
import LandingPage from './views/landing-page'
import UploadPage from './views/upload-page'
import NotFound from './views/not-found'

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Web3Provider>
  )
}

export default App
