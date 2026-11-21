'use client'

import { Category } from '@/types'
import { useLang } from '@/lib/i18n'

interface Props {
  categories: Category[]
  active: string | number | 'all'
  onSelect: (cat: string | number | 'all') => void
  isLoading?: boolean
}

const getIconClass = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('starter')  || n.includes('مقبلات'))  return 'fa-solid fa-leaf'
  if (n.includes('main')     || n.includes('رئيسي'))   return 'fa-solid fa-utensils'
  if (n.includes('dessert')  || n.includes('حلويات'))  return 'fa-solid fa-cake-candles'
  if (n.includes('drink')    || n.includes('مشروبات')) return 'fa-solid fa-wine-glass'
  return 'fa-solid fa-pizza-slice'
}

export default function CategoryNav({ categories, active, onSelect, isLoading }: Props) {
  const { t } = useLang()

  if (isLoading) {
    return (
      <aside className="cat-nav">
        <span className="cat-label">{t('menu.loadingShort')}</span>
        <div className="cat-btn" style={{ opacity: 0.5 }}>
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
      </aside>
    )
  }

  return (
    <aside className="cat-nav">
      <span className="cat-label">{t('menu.browseBy')}</span>

      <button
        className={`cat-btn${active === 'all' ? ' active' : ''}`}
        onClick={() => onSelect('all')}
      >
        <i className="fa-solid fa-grip" />
        <span className="cat-label">{t('menu.allSelections')}</span>
      </button>

      {categories.map((cat) => {
        const isActive = String(active) === String(cat.id)
        return (
          <button
            key={cat.id}
            className={`cat-btn${isActive ? ' active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <i className={getIconClass(cat.name)} />
            <span className="cat-label">{cat.name}</span>
          </button>
        )
      })}
    </aside>
  )
}