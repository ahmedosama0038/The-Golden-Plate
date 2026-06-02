'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '@/lib/api'
import type { Category } from '@/types'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'

export default function AdminCategoryPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')

  // جلب الأقسام
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: categoryApi.getAll,
  })
// ── Mutation الإضافة والتعديل بعد تعديل الـ FormData ──
  const saveMutation = useMutation({
    mutationFn: async () => {
      // بنجهز الداتا اللي رايحة للـ API
      const payload = { 
        name: categoryName, 
        imageFile: null // بنبعته null حالياً طالما مفيش زرار رفع صور في المودال ده
      }

      if (selectedCategory) {
        return categoryApi.update(selectedCategory.id, payload)
      } else {
        return categoryApi.create(payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(selectedCategory ? 'Category updated successfully' : 'Category added successfully')
      closeModal()
    },
    onError: (err: any) => {
      // لإظهار تفاصيل الأيرور لو السيرفر رجع رسالة معينة
      const errMsg = err.response?.data?.message || err.message
      toast.error('Operation failed', typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg)
    }
  })

  // Mutation الحذف
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully')
    },
    onError: (err: any) => {
      toast.error('Failed to delete category')
    }
  })

  const openModal = (category: Category | null = null) => {
    setSelectedCategory(category)
    setCategoryName(category ? category.name : '')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
    setCategoryName('')
  }

  return (
    <>
      <TopBar title="Categories" />
      <div className="adm-content">
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
          <button className="adm-btn primary" onClick={() => openModal()}>
            <i className="fa-solid fa-plus" /> Add Category
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              <div className="adm-table-title">All Categories ({categories.length})</div>
            </div>

            {categories.length === 0 ? (
              <div className="adm-empty">
                <i className="fa-solid fa-folder-open" />
                <p>No categories found.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600, color: 'var(--adm-muted)', width: '80px' }}>#{cat.id}</td>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cat.name}</td>
                      <td style={{ width: '120px' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="adm-btn ghost" onClick={() => openModal(cat)}>
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button
                            className="adm-btn danger"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              toast.confirm(
                                'Are you sure?',
                                'Deleting this category might affect linked products!',
                                () => deleteMutation.mutate(cat.id)
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
            )}
          </div>
        )}
      </div>

      {/* Pop-up Modal الصغير المدمج للإضافة والتعديل سريعاً */}
      {showModal && (
        <div className="adm-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="adm-modal-card" style={{ background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--adm-gold)' }}>
              {selectedCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Pizza, Drinks..."
                style={{ background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.6rem', width: '100%', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="adm-btn ghost" onClick={closeModal}>Cancel</button>
              <button 
                className="adm-btn primary" 
                disabled={saveMutation.isPending || !categoryName.trim()} 
                onClick={() => saveMutation.mutate()}
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