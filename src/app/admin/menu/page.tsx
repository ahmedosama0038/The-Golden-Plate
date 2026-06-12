'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi } from '@/lib/api'
import type { MenuItem, Category } from '@/types'
import TopBar from '@/components/admin/TopBar'
import AddProductModal from '@/components/admin/AddProductModal'
import { toast } from '@/lib/toast'

export default function AdminMenuPage() {
  const queryClient = useQueryClient()

  const [filter, setFilter] = useState<string | number | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

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
  const { data: items = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['admin-products'],
    queryFn: productApi.getAll,
  })

  // الـ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => productApi.delete(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Item deleted successfully')
      
      setLocalImages(prev => {
        const updated = { ...prev }
        delete updated[String(id)]
        return updated
      })
    },
    onError: () => {
      toast.error('Failed to delete item')
    }
  })

  const filtered = items.filter((item) => {
    const itemAny = item as any
    const currentCatId = typeof item.category === 'object' && item.category !== null
      ? String((item.category as any).id)
      : String(itemAny.categoryId || item.category)

    const matchCat = filter === 'all' || currentCatId === String(filter)
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <TopBar title="Menu Management" subtitle="Add, edit, or remove dishes from the menu." />
      
      <div className="adm-content">
        
        {/* Toolbar - الفلترة والبحث والإضافة بنفس ديزاين الـ Extras الموحد */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="adm-loading-state">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading your premium dishes...</p>
          </div>
        )}

        {/* Table - جدول فخم متناسق ومطابق للصورة المطلوبة */}
        {!isLoading && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Dish Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const itemAny = item as any

                  const displayPrice = itemAny.priceList && itemAny.priceList.length > 0 
                    ? `$${itemAny.priceList[0].price}` 
                    : `$${itemAny.price || 0}`

                  const backendSrc = itemAny.imageUrl || itemAny.image
                  
                  const dynamicSrc = localImages[String(item.id)] || localImages[item.name] || 
                    ((backendSrc && typeof backendSrc === 'string' && backendSrc.startsWith('http')) 
                      ? backendSrc 
                      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop')

                  const categoryName = typeof item.category === 'object' && item.category !== null
                    ? (item.category as any).name 
                    : categories.find(c => String(c.id) === String(itemAny.categoryId || item.category))?.name || 'Mains'

                  return (
                    <tr key={item.id} className="adm-table-row">
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
                        <div className="adm-actions-cell">
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
                    <td colSpan={5} className="adm-empty-table">
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
          onProductAdded={(name: string, imgSrc: string) => {
            if (imgSrc) {
              const key = selectedItem?.id || name
              setLocalImages(prev => ({ ...prev, [String(key)]: imgSrc }))
            }
          }}
        />
      )}
    </>
  )
}