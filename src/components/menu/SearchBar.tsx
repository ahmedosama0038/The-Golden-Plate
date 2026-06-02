
// ============================================================
//  SearchBar.tsx — خانة البحث
//  نفس .menu-search من style.css
// ============================================================
'use client'

interface Props {
  value: string
  onChange: (val: string) => void
  resultsCount?: number   // عدد النتايج — بيظهر لما يكتب
}

export default function SearchBar({ value, onChange, resultsCount }: Props) {
  return (
    <div>
      {/* .menu-search */}
      <div className="menu-search">
        <i className="fa-solid fa-magnifying-glass" />
        <input className=" "
          type="text"
          placeholder="Search by name, ingredient, or description..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {/* زرار مسح البحث — يظهر بس لو فيه نص */}
        {value && (
          <button
            className="menu-search-clear"
            style={{ display: 'block' }}
            onClick={() => onChange('')}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {/* عدد النتايج — يظهر بس لما يكتب */}
      {value && resultsCount !== undefined && (
        <div className="search-results-count">
          {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  )
}
