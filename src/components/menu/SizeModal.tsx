
// ============================================================
//  SizeModal.tsx — الـ popup لما الأيتم عنده أحجام
//  نفس .size-modal-overlay من style.css
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import { MenuItem, MenuItemSize } from '@/types'

interface Props {
  item: MenuItem | null      // الأيتم المختار (null = المودال مغلق)
  onClose: () => void
  onAdd: (item: MenuItem, size: MenuItemSize) => void
}

export default function SizeModal({ item, onClose, onAdd }: Props) {
  const [selected, setSelected] = useState<MenuItemSize | null>(null)

  useEffect(() => {
    setSelected(null)
  }, [item])

  // لو مفيش item = المودال مغلق
  if (!item) return null

  const handleAdd = () => {
    if (!selected) return
    onAdd(item, selected)
    setSelected(null)
    onClose()
  }

  return (
    // .size-modal-overlay.open
    <div
      className="size-modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="size-modal">

        {/* Header */}
        <div className="size-modal-header">
          <h3>{item.name}</h3>
          <button className="size-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body — قائمة الأحجام */}
        <div className="size-modal-body">
          {item.sizes?.map((size) => (
            <div
              key={size.label}
              // .size-option + .selected لو هو المختار
              className={`size-option${selected?.label === size.label ? ' selected' : ''}`}
              onClick={() => setSelected(size)}
            >
              <span className="size-option-label">{size.label}</span>
              <span className="size-option-price">${size.price}</span>
            </div>
          ))}

          {/* زرار Add */}
          <button
            className="size-modal-add"
            disabled={!selected}
            onClick={handleAdd}
          >
            Add to Order
          </button>
        </div>

      </div>
    </div>
  )
}