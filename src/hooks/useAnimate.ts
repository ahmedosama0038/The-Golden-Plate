'use client'

import { useEffect, type DependencyList } from 'react'

export function useAnimate(deps: DependencyList = []) {
  // deps = لو الداتا اتغيرت → شغّل الـ observer تاني
  // مفيد لما الـ elements بتيجي من API بعد الـ render

  useEffect(() => {
    let observer: IntersectionObserver | null = null

    // وقت صغير عشان الـ DOM يتحدث الأول
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.animate:not(.visible)')

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.1 }
      )

      elements.forEach((el) => observer?.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeout)
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}