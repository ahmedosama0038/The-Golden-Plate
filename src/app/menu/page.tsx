      
'use client'

import { useState, useMemo, useEffect }          from 'react'
import { useQuery }                   from '@tanstack/react-query'
import { productApi, categoryApi }    from '@/lib/api'
import type { MenuItem, MenuItemSize, Category } from '@/types'
import { useCart }    from '@/hooks/useCart'
import { useAnimate } from '@/hooks/useAnimate'
import CategoryNav    from '@/components/menu/CategoryNav'
import SearchBar      from '@/components/menu/SearchBar'
import MenuList       from '@/components/menu/MenuList'
import SizeModal      from '@/components/menu/SizeModal'

export default function MenuPage() {
  useAnimate()

  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [modalItem,      setModalItem]      = useState<MenuItem | null>(null)

  const { addToCart } = useCart()

  // 🎯 جلب خزنة الصور المحلية المشتركة مع الـ Admin عشان تسمع هنا فوراً
  const [localImages, setLocalImages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // بنقرأ من نفس المفاتيح اللي سجلناها في الـ Admin
      const savedPhotos = localStorage.getItem('restaurant_photos') || localStorage.getItem('admin_menu_images')
      if (savedPhotos) {
        setLocalImages(JSON.parse(savedPhotos))
      }
    }
  }, [])

  // ── جيب الـ Categories ──
  const {
    data:      categories = [],
    isLoading: categoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn:  categoryApi.getAll,
  })

  // ── جيب الـ Products ──
  const {
    data:      products = [],
    isLoading: productsLoading,
    isError,
    error,
  } = useQuery<MenuItem[]>({
    queryKey: ['products', activeCategory],
    queryFn:  () =>
      activeCategory === 'all'
        ? productApi.getAll()
        : productApi.getByCategory(String(activeCategory)),
  })

  // ── تظبيط البيانات والأسعار والصور الساقطة من السيرفر حركياً ──
  const mappedProducts = useMemo(() => {
    return products.map((item) => {
      const itemAny = item as any;

      // 1️⃣ حل مقلب الـ 404 في الصور: الربط بالـ localStorage المشترك أو الباكيند أو Unsplash
      const backendSrc = itemAny.imageUrl || itemAny.image;
      const dynamicSrc = localImages[String(item.id)] || localImages[item.name] || 
        ((backendSrc && typeof backendSrc === 'string' && backendSrc.startsWith('http')) 
          ? backendSrc 
          : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop');

      // 2️⃣ حل مقلب الـ $0 في الأسعار: فحص الـ PriceList والـ Sizes
      let finalPrice = itemAny.price || 0;
      if (itemAny.priceList && itemAny.priceList.length > 0) {
        finalPrice = itemAny.priceList[0].price;
      } else if (itemAny.sizes && itemAny.sizes.length > 0) {
        finalPrice = itemAny.sizes[0].price;
      }

      return {
        ...item,
        image: dynamicSrc, // تمرير المسار السليم للـ MenuList
        imageUrl: dynamicSrc,
        price: finalPrice
      };
    });
  }, [products, localImages]);

  // ── Search Filter ──
  const filtered = useMemo(() => {
    if (!searchQuery) return mappedProducts
    const q = searchQuery.toLowerCase()
    return mappedProducts.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    )
  }, [mappedProducts, searchQuery])

  // ── Handlers ──
  const handleAdd = (item: MenuItem) => {
    if (item.sizes && item.sizes.length > 0) {
      setModalItem(item)
    } else {
      addToCart(item)
    }
  }

  const handleSizeAdd = (item: MenuItem, size: MenuItemSize) => {
    addToCart(item, size)
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
         onSelect={(cat) => setActiveCategory(cat as number | "all")}
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