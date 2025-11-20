import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_10%_10%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(800px_circle_at_90%_90%,rgba(16,185,129,0.12),transparent_40%)] pointer-events-none" />
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Bakery Workforce</Link>
          <nav className="flex gap-6 text-slate-200">
            <NavLink to="/" end className={({isActive})=>`hover:text-white ${isActive?'text-white':''}`}>Главная</NavLink>
            <NavLink to="/schedule" className={({isActive})=>`hover:text-white ${isActive?'text-white':''}`}>График</NavLink>
            {user?.is_admin && <NavLink to="/admin" className={({isActive})=>`hover:text-white ${isActive?'text-white':''}`}>Админ</NavLink>}
          </nav>
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <span>{user?.full_name}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs">{user?.role}</span>
            <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15">Выйти</button>
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
