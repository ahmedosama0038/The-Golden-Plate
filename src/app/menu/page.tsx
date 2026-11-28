'use client'

import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productApi, categoryApi, mapExtra } from '@/lib/api'
import { pickLocalized } from '@/lib/localized'
import type { MenuItem, MenuItemSize, Category, Extra, ApiProduct } from '@/types'
import { useCart } from '@/hooks/useCart'
import { useAnimate } from '@/hooks/useAnimate'
import { useLang } from '@/lib/i18n'
import CategoryNav from '@/components/menu/CategoryNav'
import SearchBar from '@/components/menu/SearchBar'
import MenuList from '@/components/menu/MenuList'
import SizeModal from '@/components/menu/SizeModal'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'

export default function MenuPage() {
  useAnimate()
  const { t, lang } = useLang()

  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)

  const { addToCart } = useCart()

  // خزنة الصور المحلية المشتركة مع الـ Admin
  const [localImages, setLocalImages] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem('restaurant_photos') || localStorage.getItem('admin_menu_images')
      if (savedPhotos) setLocalImages(JSON.parse(savedPhotos))
    } catch {}
  }, [])

  // ── جيب الـ Categories ──
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  // ── جيب كل الـ Products مرة واحدة (الفلترة بالقسم في الفرونت) ──
  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
    error,
  } = useQuery<ApiProduct[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getActive(),
  })

  // ── تظبيط البيانات والأسعار والصور والإضافات والأسماء ──
  const mappedProducts = useMemo(() => {
    return products
      .filter((item) => item.is_active !== false)
      .map((item) => {
        const name = pickLocalized(item, 'name', lang)

        // 1️⃣ الصورة: localStorage أو الباك إند أو Unsplash
        const backendSrc = item.image
        const dynamicSrc =
          localImages[String(item.id)] ||
          localImages[name] ||
          (backendSrc && backendSrc.startsWith('http') ? backendSrc : FALLBACK_IMAGE)

        // 2️⃣ الأحجام
        const sizes: MenuItemSize[] = (item.sizes ?? []).map((s) => ({
          id: s.id,
          label: s.size_name.charAt(0).toUpperCase() + s.size_name.slice(1),
          price: Number(s.price),
        }))

        // 3️⃣ السعر: أول حجم، أو base_price لو مفيش أحجام
        const finalPrice = sizes.length > 0 ? sizes[0].price : Number(item.base_price ?? 0)

        // 4️⃣ إضافات المنتج نفسه (راجعة جوا المنتج)، من غير المخفية، بأسماء حسب اللغة
        const extras: Extra[] = (item.extras ?? [])
          .map((raw) => ({ ...mapExtra(raw), name: pickLocalized(raw, 'name', lang) }))
          .filter((e) => e.isAvailableAlone && !e.isDeleted)

        return {
          ...item,
          name,
          description: pickLocalized(item, 'description', lang),
          category: item.category_id,
          categoryId: item.category_id,
          image: dynamicSrc,
          itemImage: dynamicSrc,
          imageUrl: dynamicSrc,
          price: finalPrice,
          sizes,
          extras,
        }
      })
  }, [products, localImages, lang])

  // ── فلتر القسم ──
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

  // منتج بأحجام أو بإضافات بيفتح المودال، وغير كده بيتضاف مباشرة
  const handleAdd = (item: MenuItem) => {
    const hasSizes = !!item.sizes && item.sizes.length > 0
    const hasExtras = !!item.extras && item.extras.length > 0
    if (hasSizes || hasExtras) {
      setModalItem(item)
    } else {
      addToCart(item)
    }
  }

  const handleSizeAdd = (item: MenuItem, size: MenuItemSize | undefined, extras: Extra[]) => {
    addToCart(item, size, extras)
  }

  return (
    <>
      <section className="hero hero-sm">
        <div className="hero-content animate">
          <h1>
            {t('menuPage.title1')} <span>{t('menuPage.title2')}</span> {t('menuPage.title3')}
          </h1>
          <p>{t('menuPage.subtitle')}</p>
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

          {productsLoading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
              <p>{t('menu.loading')}</p>
            </div>
          )}

          {isError && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
              <p>{t('menu.error')}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{(error as Error).message}</p>
            </div>
          )}

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