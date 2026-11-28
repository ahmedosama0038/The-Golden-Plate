'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi } from '@/lib/api'
import type { Category } from '@/types'
import TopBar from '@/components/admin/TopBar'
import AddProductModal, { type EditableProduct } from '@/components/admin/AddProductModal'
import { toast } from '@/lib/toast'
import { getErrorMessage, getErrorStatus } from '@/lib/errors'

type StatusFilter = 'all' | 'active' | 'inactive'

// شكل المنتج في جدول الأدمن (الحقول اللي الصفحة بتقراها)
interface AdminProduct extends EditableProduct {
  name: string
  description?: string | null
  categoryId?: number | string
  imageUrl?: string | null
  price?: number | string
}

export default function AdminMenuPage() {
  const queryClient = useQueryClient()

  const [filter, setFilter] = useState<string | number | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AdminProduct | null>(null)

  // 🎯 الخزنة الذكية للصور
  const [localImages, setLocalImages] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('restaurant_photos')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  useEffect(() => {
    localStorage.setItem('restaurant_photos', JSON.stringify(localImages))
  }, [localImages])

  // جلب الـ categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: categoryApi.getAll,
  })

  // جلب الـ products
  const { data: items = [], isLoading } = useQuery<AdminProduct[]>({
    queryKey: ['admin-products'],
    queryFn: async () => (await productApi.getAll()) as unknown as AdminProduct[],
  })

  // الـ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => productApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Item deleted successfully')

      setLocalImages(prev => {
        const updated = { ...prev }
        delete updated[String(id)]
        return updated
      })
    },
    onError: () => {
      toast.error(
        'Failed to delete item',
        'If this dish is linked to old orders, hide it instead (eye button).'
      )
    }
  })

  // إظهار/إخفاء المنتج
  const activeMutation = useMutation({
    mutationFn: ({ item, active }: { item: AdminProduct; active: boolean }) =>
      productApi.setActive(item, active),
    onSuccess: (_res, { active }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(active ? 'Dish is now visible on the menu' : 'Dish hidden from the menu')
    },
    onError: (err: unknown) => {
      console.error('setActive failed:', getErrorStatus(err), err)
      toast.error('Could not change status', getErrorMessage(err, 'Please try again'))
    },
  })

  // المنتج active ما لم يكن is_active === false صراحةً
  const isActive = (item: AdminProduct) => item.is_active !== false

  const activeCount = items.filter(isActive).length
  const inactiveCount = items.length - activeCount

  const filtered = items.filter((item) => {
    const currentCatId = String(item.category_id ?? item.categoryId ?? '')

    const matchCat = filter === 'all' || currentCatId === String(filter)
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? isActive(item) : !isActive(item))
    return matchCat && matchSearch && matchStatus
  })

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `All status (${items.length})` },
    { key: 'active', label: `Active (${activeCount})` },
    { key: 'inactive', label: `Inactive (${inactiveCount})` },
  ]

  return (
    <>
      <TopBar title="Menu Management" subtitle="Add, edit, or hide dishes from the menu." />

      <div className="adm-content">

        {/* Toolbar - الفلترة والبحث والإضافة */}
        <div className="adm-toolbar">
          <div className="adm-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="adm-input-search"
            />
          </div>

          <div className="adm-filter-group">
            <button
              onClick={() => setFilter('all')}
              className={`adm-btn-tab ${filter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`adm-btn-tab ${filter === c.id ? 'active' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <button
            className="adm-btn primary"
            onClick={() => { setSelectedItem(null); setShowModal(true); }}
          >
            <i className="fa-solid fa-plus" /> Add New Dish
          </button>
        </div>

        {/* فلتر الحالة */}
        <div className="adm-filter-group" style={{ marginBottom: '1rem' }}>
          {STATUS_TABS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`adm-btn-tab ${statusFilter === s.key ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="adm-loading-state">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading your premium dishes...</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Dish Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const active = isActive(item)

                  // السعر: أول حجم (الشكل الجديد) أو base_price
                  const firstSize = item.sizes?.[0]
                  const displayPrice = firstSize
                    ? `From ${firstSize.price} ج.م`
                    : `${item.base_price ?? item.price ?? 0} ج.م`

                  const backendSrc = item.imageUrl || item.image

                  const dynamicSrc = localImages[String(item.id)] || localImages[item.name] ||
                    ((backendSrc && typeof backendSrc === 'string' && backendSrc.startsWith('http'))
                      ? backendSrc
                      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop')

                  const categoryName = categories.find(
                    (c) => String(c.id) === String(item.category_id ?? item.categoryId)
                  )?.name || '—'

                  return (
                    <tr
                      key={item.id}
                      className="adm-table-row"
                      style={{ opacity: active ? 1 : 0.5 }}
                    >
                      <td style={{ width: '80px' }}>
                        <div className="adm-img-container">
                          <img
                            src={dynamicSrc}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop'
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="adm-item-name">{item.name}</div>
                        {item.description && (
                          <div className="adm-item-desc">
                            {item.description.slice(0, 70)}
                            {item.description.length > 70 ? '...' : ''}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="adm-badge-category">{categoryName}</span>
                      </td>
                      <td>
                        <span className="adm-item-price">{displayPrice}</span>
                      </td>
                      <td>
                        <span className={`adm-badge ${active ? 'green' : 'red'}`}>
                          {active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="adm-actions-cell">
                          <button
                            className="adm-action-btn edit"
                            disabled={activeMutation.isPending}
                            onClick={() => activeMutation.mutate({ item, active: !active })}
                            title={active ? 'Hide from menu' : 'Show on menu'}
                            style={{ color: active ? '#22c55e' : 'var(--adm-muted)' }}
                          >
                            <i className={`fa-solid ${active ? 'fa-eye' : 'fa-eye-slash'}`} />
                          </button>
                          <button
                            className="adm-action-btn edit"
                            onClick={() => { setSelectedItem(item); setShowModal(true); }}
                            title="Edit Dish"
                          >
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button
                            className="adm-action-btn delete"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              toast.confirm(
                                'Delete Dish',
                                `Are you sure you want to remove "${item.name}"?`,
                                () => deleteMutation.mutate(item.id)
                              )
                            }}
                            title="Delete Dish"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="adm-empty-table">
                      <i className="fa-solid fa-bowl-food" />
                      <p>No dishes found matching the criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <AddProductModal
          categories={categories}
          editItem={selectedItem}
          onClose={() => { setShowModal(false); setSelectedItem(null); }}
        />
      )}
    </>
  )
}