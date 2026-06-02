'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery }   from '@tanstack/react-query'
import { useAnimate } from '@/hooks/useAnimate'
import { useCart }    from '@/hooks/useCart'
import { productApi } from '@/lib/api'
import type { MenuItem } from '@/types'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60'

export default function MenuPreview() {
  const { addToCart } = useCart()
  const [localImages, setLocalImages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('restaurant_photos') || localStorage.getItem('admin_menu_images')
      if (saved) {
        setLocalImages(JSON.parse(saved))
      }
    }
  }, [])

  const { data: products = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ['products'],
    queryFn:  productApi.getAll,
  })

  const featured = products.slice(0, 4)

  useAnimate([products])

  return (
    <section className="section">
      <div className="section-header animate">
        <span className="section-tag">Curated Selections</span>
        <h2>A Taste of Our Menu</h2>
        <div className="divider-gold" />
        <p>Each dish tells a story of tradition, innovation, and uncompromising quality.</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
          <p>Loading menu...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
          <p>Could not load menu items.</p>
        </div>
      )}

      {/* Products */}
      {!isLoading && !isError && (
        <div className="preview-grid" id="previewGrid">
          {featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
              <p>No menu items available yet.</p>
            </div>
          ) : (
            featured.map((item) => {
              const id          = String(item.id || item.Id || Math.random())
              const name        = item.name        || item.Name        || 'Delicious Dish'
              const description = item.description || item.Description || 'No description available.'
              const price       = Number(item.price || item.Price || item.priceList?.[0]?.price || 0)

              const rawImage    = item.itemImage || item.imageUrl || item.image || item.Image
              const backendSrc  = typeof rawImage === 'string' && rawImage.length > 0 ? rawImage : ''
              const itemImage   = localImages[String(item.id)] || localImages[item.name] || backendSrc || FALLBACK_IMAGE

              // normalized MenuItem عشان useCart يفهمه
              const normalizedItem: MenuItem = {
                id,
                name,
                description,
                price,
                category:  item.category || item.categoryName || 'mains',
                image:     itemImage,
                itemImage: backendSrc || itemImage,
                available: true,
              }

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
                      <span className="item-price">${price.toFixed(2)}</span>
                      {/* ✅ بنبعت MenuItem كامل لـ addToCart */}
                      <button className="add-btn" onClick={() => addToCart(normalizedItem)}>
                        <span>Add to Order</span>
                      </button>
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
          View Full Menu <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.4rem' }} />
        </Link>
      </div>
    </section>
  )
}
