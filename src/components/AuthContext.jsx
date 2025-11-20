import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const base = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (token) {
      fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(d => d && setUser(d))
        .catch(() => {})
    }
  }, [token, base])

  const login = async (username, password) => {
    const r = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!r.ok) throw new Error('Неверный логин или пароль')
    const d = await r.json()
    setToken(d.token)
    localStorage.setItem('token', d.token)
    setUser(d.user)
  }

  const logout = async () => {
    try {
      await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    } catch {}
    setUser(null)
    setToken('')
    localStorage.removeItem('token')
  }

  const value = { user, token, login, logout, base }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
