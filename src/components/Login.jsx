import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import GlassCard from './GlassCard'
import { useAuth } from './AuthContext'

export default function Login() {
  const { login, user } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_0%_0%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(600px_circle_at_100%_100%,rgba(16,185,129,0.15),transparent_40%)]" />
      <GlassCard className="relative p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">Вход в систему</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-200 mb-1">Логин</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-slate-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="username" />
          </div>
          <div>
            <label className="block text-sm text-slate-200 mb-1">Пароль</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-slate-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button disabled={loading} className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
