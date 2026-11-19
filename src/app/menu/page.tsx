'use client'

import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productApi, categoryApi } from '@/lib/api'
import type { MenuItem, MenuItemSize, Category, Extra } from '@/types'
import { useCart } from '@/hooks/useCart'
import { useAnimate } from '@/hooks/useAnimate'
import CategoryNav from '@/components/menu/CategoryNav'
import SearchBar from '@/components/menu/SearchBar'
import MenuList from '@/components/menu/MenuList'
import SizeModal from '@/components/menu/SizeModal'

export default function MenuPage() {
  useAnimate()

  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)

  const { addToCart } = useCart()

  // 🎯 جلب خزنة الصور المحلية المشتركة مع الـ Admin
  const [localImages, setLocalImages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhotos = localStorage.getItem('restaurant_photos') || localStorage.getItem('admin_menu_images')
      if (savedPhotos) {
        setLocalImages(JSON.parse(savedPhotos))
      }
    }
  }, [])

  // ── جيب الـ Categories ──
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  // ── 🆕 جيب كل الـ Products مرة واحدة (الفلترة بالقسم في الفرونت) ──
  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
    error,
  } = useQuery<MenuItem[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  })

  // ── تظبيط البيانات والأسعار والصور ──
  const mappedProducts = useMemo(() => {
    return products
      .filter((item) => (item as any).is_active !== false) // 🆕 المنتج المقفول مايظهرش
      .map((item) => {
        const itemAny = item as any

        // 1️⃣ الصورة: localStorage أو الباك إند أو Unsplash
        const backendSrc = itemAny.imageUrl || itemAny.image
        const dynamicSrc =
          localImages[String(item.id)] ||
          localImages[item.name] ||
          (backendSrc && typeof backendSrc === 'string' && backendSrc.startsWith('http')
            ? backendSrc
            : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop')

        // 2️⃣ الأحجام: الشكل الجديد (sizes) أو القديم (priceList)
        const sizes = itemAny.sizes?.length
          ? itemAny.sizes.map((s: any) => ({
              label: s.size_name.charAt(0).toUpperCase() + s.size_name.slice(1),
              price: Number(s.price),
            }))
          : (itemAny.priceList?.map((p: any) => ({
              label:
                p.size === 1 ? 'Small'
                : p.size === 2 ? 'Medium'
                : p.size === 3 ? 'Large'
                : `Size ${p.size}`,
              price: p.price,
            })) ?? [])

        // 3️⃣ السعر: أول حجم، أو base_price لو مفيش أحجام
        const finalPrice = sizes.length > 0
          ? sizes[0].price
          : Number(itemAny.base_price ?? itemAny.price ?? 0)

        // 4️⃣ 🆕 رقم القسم (من الشكل الجديد أو القديم)
        const categoryId =
          itemAny.category_id ??
          itemAny.categoryId ??
          (typeof itemAny.category === 'object' ? itemAny.category?.id : itemAny.category)

        return {
          ...item,
          image: dynamicSrc,
          imageUrl: dynamicSrc,
          price: finalPrice,
          sizes,
          categoryId,
        }
      })
  }, [products, localImages])

  // ── 🆕 فلتر القسم ──
  const categoryFiltered = useMemo(() => {
    if (activeCategory === 'all') return mappedProducts
    return mappedProducts.filter(
      (item) => String(item.categoryId) === String(activeCategory)
    )
  }, [mappedProducts, activeCategory])

  // ── Search Filter ──
  const filtered = useMemo(() => {
    if (!searchQuery) return categoryFiltered
    const q = searchQuery.toLowerCase()
    return categoryFiltered.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    )
  }, [categoryFiltered, searchQuery])

  const handleAdd = (item: MenuItem) => {
    if (item.sizes && item.sizes.length > 0) {
      setModalItem(item)
    } else {
      addToCart(item) // لو مفيش sizes → أضف للكارت مباشرة
    }
  }

  const handleSizeAdd = (item: MenuItem, size: MenuItemSize, extras: Extra[]) => {
    addToCart(item, size, extras)
  }

  return (
    <>
      <section className="hero hero-sm">
        <div className="hero-content animate">
          <h1>Our <span>Exquisite</span> Menu</h1>
          <p>Discover a symphony of flavors, carefully crafted to elevate your dining experience.</p>
        </div>
      </section>

      <div className="menu-layout">
        <CategoryNav
          categories={categories}
          active={activeCategory}
          onSelect={(cat) => setActiveCategory(cat as number | 'all')}
          isLoading={categoriesLoading}
        />

        <div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultsCount={filtered.length}
          />

          {/* Loading */}
          {productsLoading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
              <p>Loading menu...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
              <p>{(error as Error).message}</p>
            </div>
          )}

          {/* Data */}
          {!productsLoading && !isError && (
            <MenuList items={filtered} onAdd={handleAdd} />
          )}
        </div>
      </div>

      <SizeModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAdd={handleSizeAdd}
      />
    </>
  )
}