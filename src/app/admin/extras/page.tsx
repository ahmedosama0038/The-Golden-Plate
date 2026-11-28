'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/errors'
import type { Extra, ExtraSize } from '@/types'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'
import { extraApi } from '@/lib/api'
import { compressImage } from '@/lib/compressImage'

// ─── فورم الإكسترا ──────────────────────────────────────────
// الإكسترا زي المنتج: يا إما سعر واحد، يا إما أحجام بأسعار
type ExtraFormState = {
  name: string
  description: string
  imageFile: File | null
  hasSizes: boolean
  price: string                     // سعر واحد (نص عشان الـ input)
  sizes: { size_name: string; price: string }[]
  isAvailableAlone: boolean
}

const SIZE_OPTIONS = ['small', 'medium', 'large'] as const
const sizeKey = (name: string) => name.trim().toLowerCase()
const validSizeRows = (sizes: ExtraFormState['sizes']) =>
  sizes.length > 0 &&
  sizes.every((s) => s.size_name.trim() !== '' && s.price.trim() !== '' && Number.isFinite(Number(s.price)) && Number(s.price) >= 0) &&
  new Set(sizes.map((s) => sizeKey(s.size_name))).size === sizes.length

const EMPTY_FORM: ExtraFormState = {
  name: '',
  description: '',
  imageFile: null,
  hasSizes: false,
  price: '',
  sizes: [{ size_name: '', price: '' }],
  isAvailableAlone: true,
}

// عرض السعر في الجدول: سعر واحد أو مدى أسعار الأحجام
function priceLabel(e: Extra): string {
  if (e.hasSizes && e.sizes && e.sizes.length > 0) {
    const prices = e.sizes.map((s) => Number(s.price))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `${min} ج.م` : `${min} - ${max} ج.م`
  }
  return `${e.price} ج.م`
}

export default function AdminExtrasPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null)
  const [form, setForm] = useState<ExtraFormState>(EMPTY_FORM)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setForm((f) => ({ ...f, imageFile: null }))
      setPreview((selectedExtra as any)?.image ?? null)
      return
    }
    setCompressing(true)
    try {
      const compressed = await compressImage(file)
      setForm((f) => ({ ...f, imageFile: compressed }))
      setPreview(URL.createObjectURL(compressed))
    } finally {
      setCompressing(false)
    }
  }

  // 1. جلب الإضافات (الباك بيرجّع Array علطول)
  const { data: extras = [], isLoading } = useQuery<Extra[]>({
    queryKey: ['admin-extras'],
    queryFn: async () => {
      const res = await extraApi.getAll()
      return res.filter((item: Extra) => !item.isDeleted)
    },
  })

  // 2. حفظ (إضافة أو تعديل)
  const saveMutation = useMutation({
    mutationFn: async (data: ExtraFormState) => {
      if (data.hasSizes && !validSizeRows(data.sizes)) {
        throw new Error('Choose a different size and a valid price for each row.')
      }
      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        imageFile: data.imageFile,
        price: data.hasSizes ? 0 : Number(data.price),
        isAvailableAlone: data.isAvailableAlone,
        hasSizes: data.hasSizes,
        sizes: data.hasSizes
          ? data.sizes
              .filter((s) => s.size_name.trim() && s.price !== '')
              .map((s) => ({ size_name: s.size_name.trim(), price: Number(s.price) }))
          : [],
      }
      if (selectedExtra) {
        return extraApi.update(selectedExtra.id, payload)
      }
      return extraApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
      queryClient.invalidateQueries({ queryKey: ['extras'] })
      toast.success(selectedExtra ? 'Extra updated successfully' : 'Extra added successfully')
      closeModal()
    },
   onError: (err: unknown) => {
  toast.error('Operation failed', getErrorMessage(err, 'Operation failed'))
},
  })

  // 3. حذف
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => extraApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
      queryClient.invalidateQueries({ queryKey: ['extras'] })
      toast.success('Extra deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete extra')
    },
  })

  const openModal = (extra: Extra | null = null) => {
    setSelectedExtra(extra)
    setPreview((extra as any)?.image ?? null)
    if (extra) {
      setForm({
        name: extra.name,
        description: String((extra as any).description ?? ''),
        imageFile: null,
        hasSizes: !!extra.hasSizes,
        price: extra.hasSizes ? '' : String(extra.price ?? ''),
        sizes:
          extra.hasSizes && extra.sizes && extra.sizes.length > 0
            ? extra.sizes.map((s: ExtraSize) => ({ size_name: s.size_name, price: String(s.price) }))
            : [{ size_name: '', price: '' }],
        isAvailableAlone: extra.isAvailableAlone,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedExtra(null)
    setForm(EMPTY_FORM)
    setPreview(null)
  }

  // ── صفوف الأحجام في الفورم ──
  const setSizeRow = (i: number, field: 'size_name' | 'price', value: string) => {
    setForm((f) => {
      if (field === 'size_name' && f.sizes.some((s, idx) => idx !== i && sizeKey(s.size_name) === sizeKey(value) && value !== '')) return f
      const sizes = [...f.sizes]
      sizes[i] = { ...sizes[i], [field]: value }
      return { ...f, sizes }
    })
  }
  const canAddSize = form.sizes.every((s) => s.size_name.trim() !== '') &&
    SIZE_OPTIONS.some((name) => !form.sizes.some((s) => sizeKey(s.size_name) === name))
  const addSizeRow = () => {
    if (canAddSize) setForm((f) => ({ ...f, sizes: [...f.sizes, { size_name: '', price: '' }] }))
  }
  const removeSizeRow = (i: number) =>
    setForm((f) => ({ ...f, sizes: f.sizes.length > 1 ? f.sizes.filter((_, idx) => idx !== i) : f.sizes }))

  // ── تحقق بسيط قبل الحفظ ──
  const formValid =
    form.name.trim() !== '' &&
    (form.hasSizes
      ? validSizeRows(form.sizes)
      : form.price !== '' && Number(form.price) >= 0)

  return (
    <>
      <TopBar title="Extras" />
      <div className="adm-content">

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
          <button className="adm-btn primary" onClick={() => openModal()}>
            <i className="fa-solid fa-plus" /> Add Extra
          </button>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
          </div>
        )}

        {!isLoading && (
          <div className="adm-table-wrap" style={{ overflowX: 'auto' }}>
            <div className="adm-table-header">
              <div className="adm-table-title">All Extras ({extras.length})</div>
            </div>

            {extras.length === 0 ? (
              <div className="adm-empty">
                <i className="fa-solid fa-plus-minus" />
                <p>No extras found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', maxWidth: '100%' }}>
              <table style={{ minWidth: '640px' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Extra Name</th>
                    <th>Price</th>
                    <th>Sizes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {extras.map((extra) => (
                    <tr key={extra.id}>
                      <td style={{ fontWeight: 600, color: 'var(--adm-muted)', width: '80px' }}>#{extra.id}</td>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{extra.name}</td>
                      <td style={{ fontWeight: 600 }}>{priceLabel(extra)}</td>
                      <td style={{ color: 'var(--adm-muted)', fontSize: '0.85rem' }}>
                        {extra.hasSizes && extra.sizes?.length
                          ? extra.sizes.map((s) => s.size_name).join(', ')
                          : '-'}
                      </td>
                      <td>
                        <span className={`adm-status ${extra.isAvailableAlone ? 'success' : 'danger'}`} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {extra.isAvailableAlone ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ width: '120px' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="adm-btn ghost" onClick={() => openModal(extra)}>
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button
                            className="adm-btn danger"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              toast.confirm(
                                'Are you sure?',
                                'Deleting this extra will remove it from the menu options!',
                                () => deleteMutation.mutate(extra.id)
                              )
                            }}
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pop-up Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="adm-modal-card" style={{ background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--adm-gold)' }}>
              {selectedExtra ? 'Edit Extra' : 'Add New Extra'}
            </h3>

            {/* الاسم */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>Extra Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Extra Cheese..."
                style={{ background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.6rem', width: '100%', outline: 'none' }}
              />
            </div>

            {/* الوصف */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. صوص إضافي"
                style={{ background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.6rem', width: '100%', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* الصورة */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>
                Image {selectedExtra ? '(سيبها فاضية لو مش عايز تغيرها)' : '(optional)'}
              </label>
              <input type="file" accept="image/*" onChange={handleImage} style={{ color: 'var(--adm-text)' }} />
              {compressing && <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--adm-muted)' }}>جاري تصغير الصورة...</p>}
              {preview && <img src={preview} alt="Preview" style={{ marginTop: '0.6rem', width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }} />}
            </div>

            {/* ليه أحجام ولا سعر واحد؟ زي فورم المنتج بالظبط */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--adm-text)' }}>
                <input
                  type="checkbox"
                  checked={form.hasSizes}
                  onChange={(e) => setForm({ ...form, hasSizes: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                This extra has sizes (small / medium / large)
              </label>
            </div>

            {form.hasSizes ? (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>
                  Sizes & prices * (املا حجم واحد على الأقل)
                </label>
                {form.sizes.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <select
                      aria-label={`Size ${i + 1}`}
                      value={s.size_name}
                      onChange={(e) => setSizeRow(i, 'size_name', e.target.value)}
                      style={{ flex: 1, minWidth: 0, background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.55rem', outline: 'none' }}
                    >
                      <option value="" disabled>Choose size</option>
                      {s.size_name && !SIZE_OPTIONS.some((name) => name === s.size_name) && (
                        <option value={s.size_name}>{s.size_name} (saved)</option>
                      )}
                      {SIZE_OPTIONS.map((name) => (
                        <option key={name} value={name} disabled={form.sizes.some((other, idx) => idx !== i && sizeKey(other.size_name) === name)}>
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      value={s.price}
                      onChange={(e) => setSizeRow(i, 'price', e.target.value)}
                      style={{ width: '90px', background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.55rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      className="adm-btn ghost"
                      onClick={() => removeSizeRow(i)}
                      disabled={form.sizes.length === 1}
                      title="Remove size"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                ))}
                <button type="button" className="adm-btn ghost" onClick={addSizeRow} disabled={!canAddSize} style={{ marginTop: '0.25rem' }}>
                  <i className="fa-solid fa-plus" /> Add size
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>Price (EGP)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 20"
                  style={{ background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.6rem', width: '100%', outline: 'none' }}
                />
              </div>
            )}

            {/* متاح ولا لأ */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="isAvailableAlone"
                checked={form.isAvailableAlone}
                onChange={(e) => setForm({ ...form, isAvailableAlone: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="isAvailableAlone" style={{ fontSize: '0.85rem', color: 'var(--adm-text)', cursor: 'pointer', userSelect: 'none' }}>
                Available in Kitchen
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn ghost" onClick={closeModal}>Cancel</button>
              <button
                type="button"
                className="adm-btn primary"
                disabled={!formValid || saveMutation.isPending}
                onClick={() => saveMutation.mutate(form)}
              >
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
