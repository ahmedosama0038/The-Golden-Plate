
// ============================================================
//  StatsCounter.tsx — الأرقام المتحركة
//  Client Component — عشان فيه animation + useEffect + useState
// ============================================================
'use client'

import { useState, useEffect, useRef } from 'react'
import { restaurantData } from '@/data/restaurant'

// ── إيه الـ useRef؟ ──
// useRef = بيخزن قيمة بدون ما يعمل re-render
// هنا بنستخدمه عشان نشوف لو الـ animation اشتغلت قبل كده أو لأ
// عشان متشغلش أكتر من مرة

interface StatItemProps {
  value: number    // الرقم النهائي
  suffix: string   // '+' أو 'K' أو '%'
  label: string    // "Years of Craft"
  started: boolean // هل العد بدأ؟
}

// ── كومبوننت صغير لكل رقم ──
function StatItem({ value, suffix, label, started }: StatItemProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // لو العد ما بدأش لسه → مستنى
    if (!started) return

    // duration = وقت العد الكلي (2 ثانية)
    const duration = 2000
    // steps = عدد المراحل (60 frame في الثانية)
    const steps = 60
    const stepTime = duration / steps
    const increment = value / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    // cleanup: لو الـ component اتشال قبل ما العد يخلص
    return () => clearInterval(timer)
  }, [started, value])

  return (
    <div>
      <div className="stat-val">
        {count}
        <span className="stat-suf">{suffix}</span>
      </div>
      <p className="stat-lbl">{label}</p>
    </div>
  )
}

export default function StatsCounter() {
  const { stats } = restaurantData

  // started = هل العد بدأ؟ (لما العنصر يظهر في الشاشة)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    // IntersectionObserver — نفس اللي شرحناه في useAnimate
    // بس هنا بنستخدمه عشان نبدأ العد بس لما الـ stats تظهر
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect() // وقف المراقبة — مش محتاجينها تاني
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const STATS = [
    { value: stats.years,        suffix: '+', label: 'Years of Craft'      },
    { value: stats.guests,       suffix: 'K', label: 'Guests Served'       },
    { value: stats.awards,       suffix: '',  label: 'Culinary Awards'     },
    { value: stats.satisfaction, suffix: '%', label: 'Guest Satisfaction'  },
  ]

  return (
    <section
      ref={ref}
      className="stats-band animate"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.025), transparent)',
        borderTop: '1px solid var(--card-border)',
        borderBottom: '1px solid var(--card-border)',
        padding: '4.5rem 2rem',
        textAlign: 'center',
      }}
    >
      <div className="stats-grid">
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} started={started} />
        ))}
      </div>
    </section>
  )
}