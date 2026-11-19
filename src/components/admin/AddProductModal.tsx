'use client'

import { useState }                    from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi }                  from '@/lib/api'
import type { Category }               from '@/types'

interface Props {
  categories: Category[]
  onClose:    () => void
  editItem?:  any | null   // لو موجود → وضع التعديل
}

const SIZE_NAMES = ['small', 'medium', 'large'] as const

export default function AddProductModal({ categories, onClose, editItem }: Props) {
  const queryClient = useQueryClient()
  const isEdit = !!editItem

  // القيم الابتدائية: من المنتج لو تعديل، فاضية لو إضافة
  const [name, setName]               = useState(editItem?.name ?? '')
  const [description, setDescription] = useState(editItem?.description ?? '')
  const [categoryId, setCategoryId]   = useState<number>(Number(editItem?.category_id ?? 0))

  const [hasSizes, setHasSizes] = useState<boolean>(
    editItem ? (editItem.has_sizes ?? editItem.sizes?.length > 0) : false
  )
  const [basePrice, setBasePrice] = useState<string>(
    editItem && !editItem.has_sizes ? String(editItem.base_price ?? '') : ''
  )
  const [sizePrices, setSizePrices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { small: '', medium: '', large: '' }
    editItem?.sizes?.forEach((s: any) => {
      initial[s.size_name] = String(s.price)
    })
    return initial
  })

  // الصورة: الجديدة (لو اخترت) أو القديمة للعرض بس
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview]     = useState<string | null>(editItem?.image ?? null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setPreview(file ? URL.createObjectURL(file) : (editItem?.image ?? null))
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? productApi.update(editItem.id, data) : productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message ?? 'Failed to save item')
    },
  })

  const handleSubmit = () => {
    if (!name.trim()) return alert('Name is required')
    if (!categoryId)  return alert('Category is required')

    const fd = new FormData()
    fd.append('category_id', String(categoryId))
    fd.append('name', name.trim())
    fd.append('description', description.trim())
    fd.append('is_active', '1')

    if (hasSizes) {
      const sizes = SIZE_NAMES
        .filter((s) => Number(sizePrices[s]) > 0)
        .map((s) => ({ size_name: s, price: Number(sizePrices[s]) }))

      if (sizes.length === 0) return alert('Add at least one size price')

      sizes.forEach((s, i) => {
        fd.append(`sizes[${i}][size_name]`, s.size_name)
        fd.append(`sizes[${i}][price]`, String(s.price))
      })
    } else {
      if (!(Number(basePrice) > 0)) return alert('Price is required')
      fd.append('base_price', basePrice)
    }

    // الصورة تتبعت بس لو اخترت واحدة جديدة
    if (imageFile) fd.append('image', imageFile)

    mutation.mutate(fd)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '16px', padding: '2rem', width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--adm-gold)' }}>
            {isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button className="adm-btn ghost" onClick={onClose} style={{ padding: '0.3rem 0.6rem' }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="adm-form-group">
          <label>Name *</label>
          <input placeholder="Truffle Arancini" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="adm-form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe the dish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical', minHeight: '80px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }}
          />
        </div>

        <div className="adm-form-group">
          <label>Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }}
          >
            <option value={0}>Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="adm-form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={hasSizes}
              onChange={(e) => setHasSizes(e.target.checked)}
              style={{ width: 'auto' }}
            />
            This item has sizes (small / medium / large)
          </label>
        </div>

        {hasSizes ? (
          <div className="adm-form-group">
            <label>Size prices * (املا واحد على الأقل)</label>
            {SIZE_NAMES.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '70px', textTransform: 'capitalize', color: 'var(--adm-muted)', fontSize: '0.85rem' }}>{s}</span>
                <input
                  type="number"
                  placeholder="0"
                  value={sizePrices[s]}
                  onChange={(e) => setSizePrices({ ...sizePrices, [s]: e.target.value })}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="adm-form-group">
            <label>Price *</label>
            <input type="number" placeholder="35" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
          </div>
        )}

        <div className="adm-form-group">
          <label>Image {isEdit ? '(سيبها فاضية لو مش عايز تغيرها)' : '(optional)'}</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ marginTop: '0.75rem', width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px' }}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            className="adm-btn primary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
            disabled={mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending
              ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</>
              : <><i className={`fa-solid ${isEdit ? 'fa-check' : 'fa-plus'}`} /> {isEdit ? 'Save Changes' : 'Add Item'}</>
            }
          </button>
          <button className="adm-btn ghost" onClick={onClose} style={{ padding: '0.85rem 1.2rem' }}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}