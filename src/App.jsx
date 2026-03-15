import { useState } from 'react'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'

export default function App() {
  const [page, setPage] = useState('landing')
  return page === 'landing'
    ? <Landing onGetStarted={() => setPage('dashboard')} />
    : <Dashboard onBack={() => setPage('landing')} />
}
