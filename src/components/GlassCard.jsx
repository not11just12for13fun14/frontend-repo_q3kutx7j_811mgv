import React from 'react'

export default function GlassCard({ className = '', children }) {
  return (
    <div className={`bg-white/10 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
