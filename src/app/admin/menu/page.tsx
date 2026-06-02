'use client'

import { useState, useEffect }                     from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi }              from '@/lib/api'
import type { MenuItem, Category }               from '@/types'
import TopBar                                    from '@/components/admin/TopBar'
import AddProductModal                           from '@/components/admin/AddProductModal'
import { toast }                                 from '@/lib/toast'

export default function AdminMenuPage() {
  const queryClient = useQueryClient()

  const [filter,       setFilter]     = useState<string | number | 'all'>('all')
  const [search,       setSearch]     = useState('')
  const [showModal,    setShowModal]  = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // 🎯 الخزنة الذكية: بتقرأ الصور المتسجلة جوه المتصفح عشان تفضل عايشة بعد الريفريش
  const [localImages, setLocalImages] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('restaurant_photos')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // حفظ تلقائي في المتصفح أول ما ترفع صورة جديدة
  useEffect(() => {
    localStorage.setItem('restaurant_photos', JSON.stringify(localImages))
  }, [localImages])

  // جلب الـ categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn:  categoryApi.getAll,
  })

  // جلب الـ products
  const { data: items = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['admin-products'],
    queryFn:  productApi.getAll,
  })

  // الـ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => productApi.delete(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Item deleted successfully')
      
      // تنظيف صورة المنتج المحذوف من الخزنة
      setLocalImages(prev => {
        const updated = { ...prev };
        delete updated[String(id)];
        return updated;
      });
    },
    onError: (err: any) => {
      toast.error('Failed to delete item')
    }
  })

  const filtered = items.filter((item) => {
    const itemAny = item as any;
    const currentCatId = typeof item.category === 'object' && item.category !== null
      ? String((item.category as any).id)
      : String(itemAny.categoryId || item.category);

    const matchCat    = filter === 'all' || currentCatId === String(filter)
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <TopBar title="Menu Items" />
      <div className="adm-content">

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)', fontSize: '0.8rem' }} />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.6rem 0.9rem 0.6rem 2.2rem', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} className="adm-btn ghost" style={{ borderColor: filter === 'all' ? 'var(--adm-gold)' : undefined, color: filter === 'all' ? 'var(--adm-gold)' : undefined }}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setFilter(c.id)} className="adm-btn ghost" style={{ borderColor: filter === c.id ? 'var(--adm-gold)' : undefined, color: filter === c.id ? 'var(--adm-gold)' : undefined }}>
                {c.name}
              </button>
            ))}
          </div>

          <button className="adm-btn primary" onClick={() => { setSelectedItem(null); setShowModal(true); }}>
            <i className="fa-solid fa-plus" /> Add Item
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
            <table>
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const itemAny = item as any;

                  const displayPrice = itemAny.priceList && itemAny.priceList.length > 0 
                    ? `$${itemAny.priceList[0].price}` 
                    : `$${itemAny.price || 0}`

                  const backendSrc = itemAny.imageUrl || itemAny.image;
                  
                  // 🎯 هنا السحر كله: بنشيك الأول لو الـ id ده ليه صورة مخرنة في المتصفح بنعرضها فوراً وهي دي اللي هتحميك بعد الريفريش
                  const dynamicSrc = localImages[String(item.id)] || localImages[item.name] || 
                    ((backendSrc && typeof backendSrc === 'string' && backendSrc.startsWith('http')) ? backendSrc : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop');

                  const categoryName = typeof item.category === 'object' && item.category !== null
                    ? (item.category as any).name 
                    : categories.find(c => String(c.id) === String(itemAny.categoryId || item.category))?.name || 'Unassigned';

                  return (
                    <tr key={item.id}>
                      <td style={{ width: '48px' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                          <img
                            src={dynamicSrc}
                            alt={item.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              // حماية إضافية لو الرابط باظ حط صورة Unsplash النظيفة
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', maxWidth: '200px' }}>
                          {item.description?.slice(0, 60)}...
                        </div>
                      </td>
                      <td>
                        <span className="adm-badge gold">{categoryName}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--adm-gold)' }}>{displayPrice}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="adm-btn ghost" onClick={() => { setSelectedItem(item); setShowModal(true); }}>
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button
                            className="adm-btn danger"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              toast.confirm('Are you sure?', 'You won’t be able to revert this!', () => deleteMutation.mutate(item.id));
                            }}
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
              // بنربط الصورة بالـ id لو بنعدل، أو بالاسم مؤقتاً لو منتج جديد
              const key = selectedItem?.id || name;
              setLocalImages(prev => ({ ...prev, [String(key)]: imgSrc }));
            }
          }}
        />
      )}
    </>
  )
}