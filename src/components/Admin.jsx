import React, { useEffect, useMemo, useState } from 'react'
import GlassCard from './GlassCard'
import { useAuth } from './AuthContext'

export default function Admin() {
  const { token, base } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ username: '', full_name: '', role: 'baker', is_admin: false, password: '' })
  const [shifts, setShifts] = useState([])
  const [shiftForm, setShiftForm] = useState({ user_id: '', date: '', start_time: '08:00', end_time: '16:00', note: '' })
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const load = () => {
    fetch(`${base}/api/users`, { headers })
      .then(r=>r.json()).then(setUsers)
    fetch(`${base}/api/shifts`, { headers })
      .then(r=>r.json()).then(setShifts)
  }

  useEffect(() => { load() }, [token, base])

  const createUser = async () => {
    await fetch(`${base}/api/users`, { method: 'POST', headers, body: JSON.stringify(form) })
    setForm({ username: '', full_name: '', role: 'baker', is_admin: false, password: '' })
    load()
  }

  const createShift = async () => {
    await fetch(`${base}/api/shifts`, { method: 'POST', headers, body: JSON.stringify(shiftForm) })
    setShiftForm({ user_id: '', date: '', start_time: '08:00', end_time: '16:00', note: '' })
    load()
  }

  const deleteShift = async (id) => {
    await fetch(`${base}/api/shifts/${id}`, { method: 'DELETE', headers })
    load()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold mb-4">Создать сотрудника</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="bg-white/10 border border-white/20 rounded-lg p-2" placeholder="Логин" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
          <input className="bg-white/10 border border-white/20 rounded-lg p-2" placeholder="Имя" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} />
          <select className="bg-white/10 border border-white/20 rounded-lg p-2" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="baker">Пекарь</option>
            <option value="cashier">Кассир</option>
            <option value="cleaner">Уборщик</option>
            <option value="admin">Админ</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" checked={form.is_admin} onChange={e=>setForm({...form, is_admin:e.target.checked})}/> Администратор</label>
          <input type="password" className="bg-white/10 border border-white/20 rounded-lg p-2 col-span-2" placeholder="Пароль" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          <button onClick={createUser} className="col-span-2 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">Создать</button>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold mb-4">Создать смену</h2>
        <div className="grid grid-cols-2 gap-3">
          <select className="bg-white/10 border border-white/20 rounded-lg p-2 col-span-2" value={shiftForm.user_id} onChange={e=>setShiftForm({...shiftForm, user_id:e.target.value})}>
            <option value="">Сотрудник</option>
            {users.map(u=> <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>)}
          </select>
          <input type="date" className="bg-white/10 border border-white/20 rounded-lg p-2" value={shiftForm.date} onChange={e=>setShiftForm({...shiftForm, date:e.target.value})}/>
          <div className="flex gap-2">
            <input type="time" className="bg-white/10 border border-white/20 rounded-lg p-2 w-full" value={shiftForm.start_time} onChange={e=>setShiftForm({...shiftForm, start_time:e.target.value})}/>
            <input type="time" className="bg-white/10 border border-white/20 rounded-lg p-2 w-full" value={shiftForm.end_time} onChange={e=>setShiftForm({...shiftForm, end_time:e.target.value})}/>
          </div>
          <input className="bg-white/10 border border-white/20 rounded-lg p-2 col-span-2" placeholder="Заметка" value={shiftForm.note} onChange={e=>setShiftForm({...shiftForm, note:e.target.value})} />
          <button onClick={createShift} className="col-span-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600">Сохранить</button>
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Смены</h2>
        <div className="space-y-2">
          {shifts.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
              <div>
                <div className="font-medium">{s.user_name || s.user_id}</div>
                <div className="text-slate-300 text-sm">{s.date} • {s.start_time} — {s.end_time} {s.note?`• ${s.note}`:''}</div>
              </div>
              <button onClick={()=>deleteShift(s.id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30">Удалить</button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
