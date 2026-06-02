// ============================================================
'use client'

import { useEffect, useRef } from 'react'

export function useAnimate(deps: any[] = []) {
  // deps = لو الداتا اتغيرت → شغّل الـ observer تاني
  // مفيد لما الـ elements بتيجي من API بعد الـ render

  useEffect(() => {
    // نأخد وقت صغير عشان الـ DOM يتحدث الأول
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.animate:not(.visible)')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.1 }
      )

      elements.forEach((el) => observer.observe(el))

      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timeout)
  }, deps) // بيشتغل تاني لما deps تتغير
}
