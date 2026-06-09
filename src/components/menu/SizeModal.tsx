'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MenuItem, MenuItemSize, Extra } from '@/types'
import { extraApi } from '@/lib/api'

interface Props {
  item: MenuItem | null
  onClose: () => void
  onAdd: (item: MenuItem, size: MenuItemSize, extras: Extra[]) => void
}

export default function SizeModal({ item, onClose, onAdd }: Props) {
  const [selected, setSelected] = useState<MenuItemSize | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])

  const { data: extras = [] } = useQuery<Extra[]>({
    queryKey: ['extras'],
    queryFn: async () => {
      const res = await extraApi.getAll()
      return res.filter((e: Extra) => !e.isDeleted && e.isAvailableAlone)
    },
  })

  useEffect(() => {
    setSelected(null)
    setSelectedExtras([])
  }, [item])

  if (!item) return null

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev =>
      prev.find(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    )
  }

  const handleAdd = () => {
    if (!selected) return
    onAdd(item, selected, selectedExtras)
    setSelected(null)
    setSelectedExtras([])
    onClose()
  }

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const total = (selected?.price ?? 0) + extrasTotal

  return (
    <div
      className="size-modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="size-modal" style={{
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Header */}
        <div className="size-modal-header">
          <h3>{item.name}</h3>
          <button className="size-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body — بيتسكرول */}
        <div className="size-modal-body" style={{
          overflowY: 'auto',
          flex: 1
        }}>

          {/* الأحجام */}
          {item.sizes?.map((size) => (
            <div
              key={size.label}
              className={`size-option${selected?.label === size.label ? ' selected' : ''}`}
              onClick={() => setSelected(size)}
            >
              <span className="size-option-label">{size.label}</span>
              <span className="size-option-price">{size.price} ج.م</span>
            </div>
          ))}

          {/* الإضافات */}
          {extras.length > 0 && (
            <>
              <p style={{
                margin: '1rem 0 0.5rem',
                fontWeight: 600,
                color: 'var(--gold)'
              }}>
                Extras
              </p>

              {extras.map((extra) => {
                const isChecked = !!selectedExtras.find(e => e.id === extra.id)
                return (
                  <div
                    key={extra.id}
                    className={`size-option${isChecked ? ' selected' : ''}`}
                    onClick={() => toggleExtra(extra)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="size-option-label">
                      {isChecked && (
                        <i className="fa-solid fa-check"
                           style={{ marginRight: '0.4rem', color: 'var(--gold)' }}
                        />
                      )}
                      {extra.name}
                    </span>
                    <span className="size-option-price">+{extra.price} ج.م</span>
                  </div>
                )
              })}
            </>
          )}

          {/* السعر الكلي */}
          {selected && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.8rem 0',
              borderTop: '1px solid var(--card-border)',
              marginTop: '0.5rem',
              fontWeight: 600,
              color: 'var(--gold)'
            }}>
              <span>Total</span>
              <span>{total} ج.م</span>
            </div>
          )}

        </div>

        {/* زرار Add — ثابت برا الـ body */}
        <div style={{ padding: '1rem' }}>
        <button
  className="size-modal-add"
  disabled={!selected}
  onClick={handleAdd}
  style={{
    width: '100%',
    padding: '0.8rem',
    background: 'var(--gold)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: selected ? 'pointer' : 'not-allowed',
    opacity: selected ? 1 : 0.5,
  }}
>
  Add to Order
</button>
        </div>

      </div>
    </div>
  )
}