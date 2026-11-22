'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/lib/api'
import { toast } from '@/lib/toast'
import type { ApiOrder } from '@/types'

const STORAGE_KEY = 'admin_sound_alert'

// جرس بسيط بالكود (Web Audio) من غير ملف صوت
function playBell() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new Ctx()
    const beep = (freq: number, start: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + 0.55)
    }
    beep(880, 0)
    beep(1175, 0.25)
    setTimeout(() => ctx.close(), 1200)
  } catch {}
}

export function useNewOrderAlert(enabledPage: boolean) {
  const [soundOn, setSoundOn] = useState(false)
  const lastMaxId = useRef<number | null>(null)

  useEffect(() => {
    try {
      setSoundOn(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {}
  }, [])

  // نفس queryKey بتاع صفحات Orders وReservations عشان الطلب يتشارك
  const { data } = useQuery<ApiOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: orderApi.getAll,
    refetchInterval: 15_000,
    enabled: enabledPage,
  })

  useEffect(() => {
    if (!data || data.length === 0) return
    const maxId = Math.max(...data.map((o) => o.id))

    // أول تحميل: نسجّل الرقم من غير صوت
    if (lastMaxId.current === null) {
      lastMaxId.current = maxId
      return
    }

    if (maxId > lastMaxId.current) {
      const fresh = data.filter((o) => o.id > (lastMaxId.current as number))
      lastMaxId.current = maxId
      if (soundOn) playBell()
      const newest = fresh.sort((a, b) => b.id - a.id)[0]
      toast.success(`طلب جديد #${newest.id}`)
    }
  }, [data, soundOn])

  // لازم تتنادى من ضغطة مستخدم عشان المتصفح يسمح بالصوت
  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {}
      if (next) playBell()
      return next
    })
  }, [])

  return { soundOn, toggleSound }
}