'use client'
import { getErrorMessage } from '@/lib/errors'
import { useState }                                 from 'react'
import { useMutation, useQuery, useQueryClient }    from '@tanstack/react-query'
import { productApi, extraApi }                     from '@/lib/api'
import { compressImage }                            from '@/lib/compressImage'
import type { Category }                            from '@/types'

// شكل المنتج اللي بيجي من الباك وقت التعديل (الحقول اللي الفورم بتستخدمها بس)
interface EditableSize  { size_name: string; price: number | string }
interface EditableExtra { id: number | string }
export interface EditableProduct {
  id: number | string
  name?: string
  name_en?: string
  name_ar?: string
  description?: string | null
  description_en?: string | null
  description_ar?: string | null
  category_id?: number | string
  has_sizes?: boolean
  base_price?: number | string
  sizes?: EditableSize[]
  extras?: EditableExtra[]
  image?: string | null
  is_active?: boolean
}

// شكل الإضافة في قايمة الاختيار
interface ExtraOption {
  id: number | string
  name?: string
  name_en?: string
  name_ar?: string
  price?: number
  hasSizes?: boolean
  isAvailableAlone?: boolean
}

interface Props {
  categories: Category[]
  onClose:    () => void
  editItem?:  EditableProduct | null   // لو موجود → وضع التعديل
}

const SIZE_NAMES = ['small', 'medium', 'large'] as const
const MAX_IMAGE_BYTES = 2 * 1024 * 1024 // حد ريم: 2048KB

export default function AddProductModal({ categories, onClose, editItem }: Props) {
  const queryClient = useQueryClient()
  const isEdit = !!editItem

  // القيم الابتدائية: من المنتج لو تعديل، فاضية لو إضافة
  const [name, setName]               = useState<string>(editItem?.name_en ?? editItem?.name ?? '')
  const [nameAr, setNameAr]           = useState<string>(editItem?.name_ar ?? '')
  const [description, setDescription] = useState<string>(editItem?.description_en ?? editItem?.description ?? '')
  const [categoryId, setCategoryId]   = useState<number>(Number(editItem?.category_id ?? 0))

  const [hasSizes, setHasSizes] = useState<boolean>(
    editItem ? (editItem.has_sizes ?? (editItem.sizes?.length ?? 0) > 0) : false
  )
  const [basePrice, setBasePrice] = useState<string>(
    editItem && !editItem.has_sizes ? String(editItem.base_price ?? '') : ''
  )
  const [sizePrices, setSizePrices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { small: '', medium: '', large: '' }
    editItem?.sizes?.forEach((s) => {
      initial[s.size_name] = String(s.price)
    })
    return initial
  })

  // الإضافات المربوطة بالمنتج (IDs): من المنتج لو تعديل
  const [extraIds, setExtraIds] = useState<number[]>(() =>
    (editItem?.extras ?? []).map((e) => Number(e.id))
  )

  // كل الإضافات الموجودة (المخزن العام)
  const { data: allExtras = [] } = useQuery<ExtraOption[]>({
    queryKey: ['admin-extras-all'],
    queryFn: async () => (await extraApi.getAll()) as unknown as ExtraOption[],
  })

  const toggleExtraId = (id: number) =>
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  // الصورة: الجديدة (لو اخترت) أو القديمة للعرض بس
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [preview, setPreview]         = useState<string | null>(editItem?.image ?? null)
  const [compressing, setCompressing] = useState(false)

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (!file) {
      setImageFile(null)
      setPreview(editItem?.image ?? null)
      return
    }

    setCompressing(true)
    try {
      const compressed = await compressImage(file)

      if (compressed.size > MAX_IMAGE_BYTES) {
        alert('الصورة كبيرة جداً حتى بعد التصغير. اختار صورة تانية.')
        e.target.value = ''
        return
      }

      setImageFile(compressed)
      setPreview(URL.createObjectURL(compressed))
    } finally {
      setCompressing(false)
    }
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      editItem ? productApi.update(editItem.id, data) : productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
    },
    onError: (err: unknown) => {
      alert(getErrorMessage(err, 'Failed to save item'))
    },
  })

  const handleSubmit = () => {
    const nameEn = name.trim()
    if (!nameEn) return alert('Name is required')
    if (!categoryId)  return alert('Category is required')

    const fd = new FormData()
    fd.append('category_id', String(categoryId))
    fd.append('name', nameEn)
    fd.append('name_en', nameEn)
    // الباك بيرفض name_ar الفاضي، فلو مكتبش عربي بنستخدم الاسم الإنجليزي
    fd.append('name_ar', nameAr.trim() || nameEn)
    fd.append('description', description.trim())
    // الباك بيقرأ description_en مش description
    fd.append('description_en', description.trim())
    // نحافظ على الوصف العربي الحالي عشان التعديل ما يمسحوش
    if (editItem?.description_ar) fd.append('description_ar', editItem.description_ar)
    // الإضافة: ظاهر. التعديل: نحافظ على حالة المنتج (مش نظهر منتج مخفي بالغلط)
    fd.append('is_active', editItem && editItem.is_active === false ? '0' : '1')

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

    // الإضافات المربوطة بالمنتج
    extraIds.forEach((id) => fd.append('extras[]', String(id)))

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
          <label>Name (English) *</label>
          <input placeholder="Truffle Arancini" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="adm-form-group">
          <label>Name (Arabic)</label>
          <input
            dir="rtl"
            placeholder="أرانشيني بالترافل"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
          />
          <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
            لو سيبته فاضي هيتحط الاسم الإنجليزي مكانه.
          </p>
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

        {/* إضافات المنتج */}
        <div className="adm-form-group">
          <label>Extras for this dish</label>
          {allExtras.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>
              مفيش إضافات لسه. اعمل إضافة من صفحة Extras الأول.
            </p>
          ) : (
            allExtras.map((ex) => {
              const id = Number(ex.id)
              const label = ex.name_en || ex.name || ex.name_ar
              return (
                <label
                  key={id}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.4rem', fontSize: '0.85rem' }}
                >
                  <input
                    type="checkbox"
                    checked={extraIds.includes(id)}
                    onChange={() => toggleExtraId(id)}
                    style={{ width: 'auto' }}
                  />
                  <span>{label}</span>
                  <span style={{ color: 'var(--adm-muted)' }}>
                    {ex.hasSizes ? '(sizes)' : `(${ex.price})`}
                    {ex.isAvailableAlone === false ? ' – hidden' : ''}
                  </span>
                </label>
              )
            })
          )}
        </div>

        <div className="adm-form-group">
          <label>Image {isEdit ? '(سيبها فاضية لو مش عايز تغيرها)' : '(optional)'}</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {compressing && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--adm-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" /> جاري تصغير الصورة...
            </p>
          )}
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
            disabled={mutation.isPending || compressing}
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