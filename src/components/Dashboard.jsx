import React, { useEffect, useState } from 'react'
import GlassCard from './GlassCard'
import { useAuth } from './AuthContext'

export default function Dashboard() {
  const { token, base } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${base}/api/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .catch(()=>{})
  }, [token, base])

  if (!data) return null

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <GlassCard className="p-6 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Ближайшие смены</h2>
        <div className="space-y-3">
          {data.upcoming_shifts.length === 0 && <div className="text-slate-300 text-sm">Смен нет</div>}
          {data.upcoming_shifts.map((s)=> (
            <div key={s.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
              <div>
                <div className="font-medium">{s.date}</div>
                <div className="text-slate-300 text-sm">{s.start_time} — {s.end_time}</div>
              </div>
              {s.note && <div className="text-slate-300 text-sm">{s.note}</div>}
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold mb-4">Часы за неделю</h2>
        <div className="text-4xl font-bold">{data.weekly_hours}</div>
        <div className="text-slate-300 text-sm">час.</div>
      </GlassCard>

      <GlassCard className="p-6 md:col-span-3">
        <h2 className="text-lg font-semibold mb-4">Уведомления</h2>
        <div className="space-y-3">
          {data.notifications.length === 0 && <div className="text-slate-300 text-sm">Нет уведомлений</div>}
          {data.notifications.map(n => (
            <div key={n.id} className={`p-3 rounded-xl border ${n.level==='warning'?'bg-yellow-500/10 border-yellow-500/30': n.level==='critical'?'bg-red-500/10 border-red-500/30':'bg-white/5 border-white/10'}`}>
              <div className="font-medium">{n.title}</div>
              <div className="text-slate-300 text-sm">{n.message}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
