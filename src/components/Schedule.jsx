import React, { useEffect, useMemo, useState } from 'react'
import GlassCard from './GlassCard'
import { useAuth } from './AuthContext'

const rangeDays = (startStr, days=14) => {
  const start = new Date(startStr)
  return [...Array(days)].map((_,i)=>{
    const d = new Date(start)
    d.setDate(start.getDate()+i)
    return d.toISOString().slice(0,10)
  })
}

export default function Schedule() {
  const { token, base } = useAuth()
  const [start, setStart] = useState(() => new Date().toISOString().slice(0,10))
  const [shifts, setShifts] = useState([])

  const days = useMemo(()=>rangeDays(start, 14), [start])

  useEffect(()=>{
    const qs = new URLSearchParams({ start: days[0], end: days[days.length-1] }).toString()
    fetch(`${base}/api/shifts?${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setShifts).catch(()=>{})
  }, [token, base, days])

  const employees = useMemo(()=>{
    const map = new Map()
    shifts.forEach(s=>{ map.set(s.user_id, s.user_name || 'Сотрудник') })
    return [...map.entries()].map(([id,name])=>({id,name}))
  }, [shifts])

  const getShift = (uid, day) => shifts.find(s=>s.user_id===uid && s.date===day)

  return (
    <GlassCard className="p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">График работы</h2>
        <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg p-2"/>
      </div>
      <div className="min-w-[900px]">
        <div className="grid" style={{gridTemplateColumns: `200px repeat(${days.length}, 1fr)`}}>
          <div className="sticky left-0 bg-slate-900/50 backdrop-blur-xl p-2 border-b border-white/10">Сотрудник</div>
          {days.map(d=> <div key={d} className="p-2 text-sm border-b border-white/10">{d}</div>)}
          {employees.map(emp => (
            <React.Fragment key={emp.id}>
              <div className="sticky left-0 bg-slate-900/50 backdrop-blur-xl p-2 border-b border-white/10">{emp.name}</div>
              {days.map(d=>{
                const s = getShift(emp.id, d)
                return (
                  <div key={emp.id+d} className="p-2 text-sm border-b border-white/10">
                    {s ? <div className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 inline-block">{s.start_time} - {s.end_time}</div> : <span className="text-slate-400">—</span>}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
