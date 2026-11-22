'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'show' | 'hide' | 'gone'>('show')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hide'), 1100)
    const t2 = setTimeout(() => setPhase('gone'), 1700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div className={`splash${phase === 'hide' ? ' splash-hide' : ''}`} aria-hidden="true">
      <div className="splash-ring" />
      <div className="splash-logo">The Golden Plate</div>
      <div className="splash-bar"><span /></div>
    </div>
  )
}