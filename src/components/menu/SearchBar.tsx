
// ='use client'

import { useLang } from '@/lib/i18n'

interface Props {
  value: string
  onChange: (val: string) => void
  resultsCount?: number
}

export default function SearchBar({ value, onChange, resultsCount }: Props) {
  const { t } = useLang()

  return (
    <div>
      <div className="menu-search">
        <i className="fa-solid fa-magnifying-glass" />
        <input
          type="text"
          placeholder={t('menu.searchPlaceholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="menu-search-clear"
            style={{ display: 'block' }}
            onClick={() => onChange('')}
            aria-label="Clear"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {value && resultsCount !== undefined && (
        <div className="search-results-count">
          {t('menu.resultsFound')} {resultsCount}
        </div>
      )}
    </div>
  )
}