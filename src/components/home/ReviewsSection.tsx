'use client'

import { useState }    from 'react'
import { useQuery }    from '@tanstack/react-query'
import { useAnimate }  from '@/hooks/useAnimate'
import { useLang }     from '@/lib/i18n'
import { reviewApi }   from '@/lib/api'
import ReviewForm      from '@/components/reviews/ReviewForm'
import type { ApiReview } from '@/types'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="review-stars">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  )
}

export default function ReviewsSection() {
  useAnimate()
  const { t } = useLang()

  const [success, setSuccess] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const { data: reviewsRaw = [], isLoading } = useQuery<ApiReview[]>({
    queryKey: ['reviews'],
    queryFn:  reviewApi.getAll,
  })
  const reviews = Array.isArray(reviewsRaw) ? reviewsRaw : []

  const handleDone = () => {
    setSuccess(true)
    setFormKey((k) => k + 1)
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <>
      <section className="section section-bg">
        <div className="section-header animate">
          <span className="section-tag">{t('reviews.tag')}</span>
          <h2>{t('reviews.title')}</h2>
          <div className="divider-gold" />
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem' }} />
          </div>
        )}

        {!isLoading && (
          <div className="reviews-grid">
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
                <p>{t('reviews.empty')}</p>
              </div>
            ) : (
              reviews.map((review) => {
                const rateValue = Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0)))
                const commentText = review.comment ?? '—'
                const reviewerName: string = review.customer_name || t('reviews.guest')

                return (
                  <div key={review.id} className="review-card animate">
                    <Stars rating={rateValue} />
                    <p className="review-text">&ldquo;{commentText}&rdquo;</p>
                    <div className="review-author">
                      <div className="review-avatar">{reviewerName[0] || 'G'}</div>
                      <div>
                        <div className="review-name">{reviewerName}</div>
                        <div className="review-loc">{t('reviews.verified')}</div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn-outline animate"
            onClick={() => document.getElementById('reviewSection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('reviews.write')} <i className="fa-solid fa-pen" style={{ marginInlineStart: '0.4rem' }} />
          </button>
        </div>
      </section>

      <section className="section" id="reviewSection">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="section-header animate">
            <span className="section-tag">{t('reviews.formTag')}</span>
            <h2>{t('reviews.write')}</h2>
            <div className="divider-gold" />
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '2rem' }}>
            <ReviewForm key={formKey} onDone={handleDone} />

            {success && (
              <div style={{ marginTop: '1rem', padding: '0.9rem', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
                <i className="fa-solid fa-check-circle" style={{ marginInlineEnd: '0.4rem' }} />
                {t('reviews.success')}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}