'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery }   from '@tanstack/react-query'
import { useAnimate } from '@/hooks/useAnimate'
import { useCart }    from '@/hooks/useCart'
import { useLang, type DictKey } from '@/lib/i18n'
import { productApi } from '@/lib/api'
import type { MenuItem } from '@/types'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60'

function getSizePrices(sizes: any): number[] {
  if (!sizes) return []
  const list = Array.isArray(sizes) ? sizes : Object.values(sizes)
  return list
    .map((s: any) => Number(typeof s === 'object' && s !== null ? s.price : s))
    .filter((n) => Number.isFinite(n) && n > 0)
}

function getPriceInfo(item: any, t: (k: DictKey) => string) {
  const currency = t('currency')
  const sizePrices = getSizePrices(item.sizes)
  const base = Number(item.base_price ?? item.price ?? 0)

  if (sizePrices.length > 0) {
    const min = Math.min(...sizePrices)
    const label = sizePrices.length > 1
      ? `${t('menu.from')} ${min} ${currency}`
      : `${min} ${currency}`
    return { label, hasSizes: true, price: min }
  }
  return { label: `${base} ${currency}`, hasSizes: false, price: base }
}

export default function MenuPreview() {
  const { addToCart } = useCart()
  const { t } = useLang()
  const [localImages, setLocalImages] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('restaurant_photos') || localStorage.getItem('admin_menu_images')
      if (saved) setLocalImages(JSON.parse(saved))
    } catch {}
  }, [])

  const { data: products = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ['products'],
    queryFn:  productApi.getAll,
  })

 const featured = products.filter((p) => p.is_active !== false).slice(0, 4) 

  useAnimate([products])

  return (
    <section className="section">
      <div className="section-header animate">
        <span className="section-tag">{t('menu.tag')}</span>
        <h2>{t('menu.title')}</h2>
        <div className="divider-gold" />
        <p>{t('menu.subtitle')}</p>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
          <p>{t('menu.loading')}</p>
        </div>
      )}

      {isError && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
          <p>{t('menu.error')}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="preview-grid" id="previewGrid">
          {featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
              <p>{t('menu.empty')}</p>
            </div>
          ) : (
            featured.map((item) => {
              const id          = String(item.id)
              const name        = item.name        || t('menu.defaultName')
              const description = item.description || t('menu.noDescription')
              const { label, hasSizes, price } = getPriceInfo(item, t)

              const rawImage   = item.image_url || item.image || item.itemImage || item.imageUrl
              const backendSrc = typeof rawImage === 'string' && rawImage.length > 0 ? rawImage : ''
              const itemImage  = localImages[id] || localImages[name] || backendSrc || FALLBACK_IMAGE

              return (
                <div key={id} className="menu-card animate">
                  <div className="menu-card-img" style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                    <img
                      src={itemImage}
                      alt={name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.src !== FALLBACK_IMAGE) {
                          e.currentTarget.src = FALLBACK_IMAGE
                        }
                      }}
                    />
                  </div>
                  <div className="menu-card-body">
                    <h3>{name}</h3>
                    <p style={{ minHeight: '42px' }}>{description}</p>
                    <div className="menu-card-footer">
                      <span className="item-price">{label}</span>

                      {hasSizes ? (
                        <Link href="/menu" className="add-btn">
                          <span>{t('menu.chooseSize')}</span>
                        </Link>
                      ) : (
                        <button
                          className="add-btn"
                          onClick={() => addToCart({ ...item, id, name, description, price } as unknown as MenuItem)}
                        >
                          <span>{t('menu.addToOrder')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/menu" className="btn-outline animate">
          {t('menu.viewAll')}{' '}
          <i className="fa-solid fa-arrow-right arrow-flip" style={{ marginInlineStart: '0.4rem' }} />
        </Link>
      </div>
    </section>
  )
}