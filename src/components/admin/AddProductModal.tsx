'use client'

import { useState, useRef, useEffect }          from 'react'
import { useMutation, useQueryClient }     from '@tanstack/react-query'
import { productApi }                      from '@/lib/api'
import type { Category, CreateProductDto } from '@/types'
import Image                               from 'next/image'
import { toast }                           from '@/lib/toast'

interface AddProductModalProps {
  categories: Category[];
  onClose: () => void;
  onProductAdded?: (name: string, imgSrc: string) => void;
  editItem?: any; // 👈 استلام المنتج المطلوب تعديله هنا
}

export default function AddProductModal({ categories, onClose, onProductAdded, editItem }: AddProductModalProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── الـ State الأساسية ──
  const [form, setForm] = useState<CreateProductDto>({
    name:        '',
    description: '',
    discount:    0,
    categoryId:  0,
    priceList:   [{ price: 0, size: 1 }],
    ingredients: [],
  })

  // State إضافية لإدارة الصورة محلياً (المعاينة والملف)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // 🎯 ملء البيانات تلقائياً في حالة الـ Edit Mode
  useEffect(() => {
    if (editItem) {
      const itemAny = editItem as any;
      
      // جلب السعر الحالي من الـ priceList أو السعر المباشر
      const currentPrice = itemAny.priceList && itemAny.priceList[0] 
        ? itemAny.priceList[0].price 
        : itemAny.price || 0;

      setForm({
        name:        itemAny.name || '',
        description: itemAny.description || '',
        discount:    itemAny.discount || 0,
        categoryId:  itemAny.categoryId || (itemAny.category && typeof itemAny.category === 'object' ? itemAny.category.id : Number(itemAny.category)) || 0,
        priceList:   [{ price: currentPrice, size: 3 }],
        ingredients: itemAny.ingredients || [],
      })

      // لو المنتج ليه صورة سابقة اعرضها في المعاينة
      if (itemAny.imageUrl || itemAny.image) {
        setImagePreview(itemAny.imageUrl || itemAny.image)
      }
    }
  }, [editItem])

  // ── معالجة اختيار الصورة ──
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // ── Mutation الإضافة ──
  const createMutation = useMutation({
    mutationFn: (data: any) => productApi.create(data),
    onSuccess: () => {
      if (onProductAdded) {
        onProductAdded(form.name, imagePreview || ''); 
      }
      toast.success('Product created successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    },
    onError: (err: any) => {
      console.error("❌ خطأ الـ API عند الإضافة:", err)
      const serverMessage = err.response?.data?.message || err.response?.data || err.message
      toast.error(`Failed to create item: ${typeof serverMessage === 'object' ? JSON.stringify(serverMessage) : serverMessage}`)
    },
  })

  // ── Mutation التعديل ──
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: any, data: any }) => productApi.update(id, data),
    onSuccess: () => {
      if (onProductAdded && imagePreview) {
        onProductAdded(form.name, imagePreview); 
      }
      toast.success('Product updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    },
    onError: (err: any) => {
      console.error("❌ خطأ الـ API عند التعديل:", err)
      const serverMessage = err.response?.data?.message || err.response?.data || err.message
      toast.error(`Failed to update item: ${typeof serverMessage === 'object' ? JSON.stringify(serverMessage) : serverMessage}`)
    },
  })

  // ── Validation + Submit ──
  const handleSubmit = () => {
    if (!form.name.trim())                 return toast.error('Name is required')
    if (!form.description.trim())          return toast.error('Description is required')
    if (!form.categoryId || form.categoryId === 0) return toast.error('Please select a valid category')
    
    const rawPrice = form.priceList && form.priceList[0] ? form.priceList[0].price : 0;
    if (!rawPrice || rawPrice <= 0)        return toast.error('Price must be greater than 0')

    const finalPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      discount: Number(form.discount) < 0 ? 0 : Number(form.discount),
      categoryId: Number(form.categoryId),
      priceList: [
        { price: Number(rawPrice), size: 3 }
      ],
      PriceList: [
        { Price: Number(rawPrice), Size: 3 }
      ],
      ingredients: [] 
    }

    if (editItem) {
      // تعديل منتج موجود
      updateMutation.mutate({ id: editItem.id, data: finalPayload })
    } else {
      // إضافة منتج جديد
      createMutation.mutate(finalPayload as any)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '16px', padding: '2rem', width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--adm-gold)', margin: 0 }}>
            {editItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button className="adm-btn ghost" onClick={onClose} style={{ padding: '0.3rem 0.6rem' }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* 📸 IMAGE UPLOAD SECTION */}
        <div className="adm-form-group" style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--adm-text)' }}>IMAGE *</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="adm-btn ghost"
              style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', border: '1px dashed var(--adm-border)', borderRadius: '8px', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-camera" /> Upload Image
            </button>

            <div style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {imagePreview ? (
                <Image
                  src={imagePreview} 
                  alt="Preview" 
                  width={64} 
                  height={64} 
                  style={{ borderRadius: '8px', objectFit: 'cover' }} 
                />
              ) : (
                <i className="fa-solid fa-image" style={{ color: 'var(--adm-muted)', fontSize: '1.2rem' }} />
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="adm-form-group">
          <label>Name *</label>
          <input
            placeholder="Truffle Arancini"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="adm-form-group">
          <label>Description *</label>
          <textarea
            placeholder="Describe the dish..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ resize: 'vertical', minHeight: '80px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }}
          />
        </div>

        {/* Category */}
        <div className="adm-form-group">
          <label>Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }}
          >
            <option value={0}>Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="adm-form-group">
          <label>Price *</label>
          <input
            type="number"
            placeholder="18"
            value={form.priceList[0].price || ''}
            onChange={(e) => setForm({
              ...form,
              priceList: [{ ...form.priceList[0], price: Number(e.target.value) }]
            })}
          />
        </div>

        {/* Discount */}
        <div className="adm-form-group">
          <label>Discount %</label>
          <input
            type="number"
            placeholder="0"
            value={form.discount || ''}
            onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
          />
        </div>

        {/* Ingredients */}
        <div className="adm-form-group">
          <label>Ingredients * (افصل بفاصلة)</label>
          <input
            placeholder="truffle, parmesan, saffron"
            value={form.ingredients.join(', ')}
            onChange={(e) => setForm({
              ...form,
              ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            })}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            className="adm-btn primary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <><i className="fa-solid fa-spinner fa-spin" /> Saving...</>
            ) : editItem ? (
              <><i className="fa-solid fa-floppy-disk" /> Save Changes</>
            ) : (
              <><i className="fa-solid fa-plus" /> Add Item</>
            )}
          </button>
          <button type="button" className="adm-btn ghost" onClick={onClose} style={{ padding: '0.85rem 1.2rem' }}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}