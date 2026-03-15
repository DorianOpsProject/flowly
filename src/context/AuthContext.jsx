import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flowly_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('flowly_token', data.token)
    localStorage.setItem('flowly_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('flowly_token', data.token)
    localStorage.setItem('flowly_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('flowly_token')
    localStorage.removeItem('flowly_user')
    setUser(null)
  }

  function updateUser(updates) {
    const updated = { ...user, ...updates }
    localStorage.setItem('flowly_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
