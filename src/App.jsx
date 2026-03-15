import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

function AppInner() {
  const { user } = useAuth()
  const [page, setPage] = useState(user ? 'dashboard' : 'landing')

  function goRegister() { setPage('register') }
  function goLogin() { setPage('login') }
  function goLanding() { setPage('landing') }
  function goDashboard() { setPage('dashboard') }

  if (user && page === 'landing') return <Dashboard onBack={() => { setPage('landing') }} />
  if (user && page !== 'dashboard' && page !== 'landing') return <Dashboard onBack={goLanding} />
  if (user) return <Dashboard onBack={goLanding} />

  if (page === 'login') return <Login onSuccess={goDashboard} onRegister={goRegister} onBack={goLanding} />
  if (page === 'register') return <Register onSuccess={goDashboard} onLogin={goLogin} onBack={goLanding} />
  return <Landing onGetStarted={goRegister} onLogin={goLogin} />
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' },
        success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
      }} />
      <AppInner />
    </AuthProvider>
  )
}
