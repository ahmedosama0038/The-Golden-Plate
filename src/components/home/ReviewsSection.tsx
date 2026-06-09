'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useAnimate } from '@/hooks/useAnimate'
import { api, reviewApi } from '@/lib/api'
import { toast } from '@/lib/toast'

// 🎯 استدعاء السكيمة والـ Type اللي أنت عاملهم في ملف السكيمات بتاعك
import { reviewSchema, ReviewData } from '../../lib/schemas' // 👈 عدل المسار حسب مكان ملفك

function Stars({ rating }: { rating: number }) {
  const parsedRate = Math.min(5, Math.max(0, Number(rating)))
  return (
    <div className="review-stars">
      {'★'.repeat(parsedRate)}{'☆'.repeat(5 - parsedRate)}
    </div>
  )
}

export default function ReviewsSection({ productId }: { productId?: number }) {
  useAnimate()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState(false)

  // ── 1. ربط React Hook Form بالسكيمة بتاعتك تلقائياً ──
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema) as Resolver<ReviewData>,
    defaultValues: {
      customerName: '',
      customerPhone: '',
      rating: 5,
      comment: '',
    }
  })

  // ── جيب الـ reviews ──
  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: ['reviews'],
    queryFn:  reviewApi.getAll,
  })

  // ── Mutation ──
  const createMutation = useMutation({
    mutationFn: (data: any) => reviewApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      
      setSuccess(true)
      reset() // 👈 تصفير كل الـ inputs بلمسة واحدة من RHF

      setTimeout(() => {
        setSuccess(false)
        window.location.reload()
      }, 1000)
    },
    onError: (err: any) => {
      toast.error('Failed to submit review', err.response?.data?.message || err.message)
    },
  })

  // ── 2. دالة الـ Submit النظيفة (البيانات بتجيلها متفلترة وجاهزة) ──
  // ── دالة الـ Submit المعدلة ──
 const onSubmit = async (data: ReviewData) => {
  const cleanProductId = Number(productId) || 1

  // ── تأكد إن الـ Customer موجود الأول ──
  try {
    await api.post('/Customer', {
      name: data.customerName.trim(),
      phone: data.customerPhone.trim(),
    })
  } catch {
    // لو الـ Customer موجود أصلاً → مش مشكلة، كمّل
  }

  const realPayload = {
    rating:        Number(data.rating),
    comment:       data.comment.trim(),
    customerName:  data.customerName.trim(),
    customerPhone: data.customerPhone.trim(),
    productId:     cleanProductId,
  }

  createMutation.mutate(realPayload)
}
  return (
    <>
      {/* ── Reviews Display ── */}
      <section className="section section-bg">
        <div className="section-header animate">
          <span className="section-tag">Guest Stories</span>
          <h2>What Our Guests Say</h2>
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
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              reviews.map((review) => {
                const id           = review.id           || review.Id || review.ID
                const rateValue    = review.rating       || review.Rating || review.rate || 0
                const commentText  = review.comment      || review.Comment || review.text || '—'
                const reviewerName = review.customerName || review.CustomerName || review.name || `Guest #${review.customerId || 0}`

                return (
                  <div key={id} className="review-card animate">
                    <Stars rating={rateValue} />
                    <p className="review-text">"{commentText}"</p>
                    <div className="review-author">
                      <div className="review-avatar">{reviewerName[0] || 'G'}</div>
                      <div>
                        <div className="review-name">{reviewerName}</div>
                        <div className="review-loc">Verified Guest</div>
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
            Write a Review <i className="fa-solid fa-pen" style={{ marginLeft: '0.4rem' }} />
          </button>
        </div>
      </section>

      {/* ── Write a Review Form ── */}
      <section className="section" id="reviewSection">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="section-header animate">
            <span className="section-tag">Share Your Experience</span>
            <h2>Write a Review</h2>
            <div className="divider-gold" />
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '2rem' }}>
            
            {/* 🎯 ربط الفورم بـ handleSubmit بتاع المكتبة */}
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Name */}
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="James Mitchell"
                  {...register('customerName')} // 👈 تدمير الـ useState والـ onChange تماماً
                />
                {errors.customerName && <p className="error-msg" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.customerName.message}</p>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  {...register('customerPhone')}
                />
                {errors.customerPhone && <p className="error-msg" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.customerPhone.message}</p>}
              </div>

              {/* Rating */}
              <div className="form-group">
                <label>Rating</label>
                <select {...register('rating')}>
                  <option value="5">★★★★★ Excellent</option>
                  <option value="4">★★★★ Very Good</option>
                  <option value="3">★★★ Good</option>
                  <option value="2">★★ Fair</option>
                  <option value="1">★ Poor</option>
                </select>
              </div>

              {/* Review */}
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your experience..."
                  {...register('comment')}
                />
                {errors.comment && <p className="error-msg" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.comment.message}</p>}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending
                  ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.4rem' }} /> Submitting...</>
                  : 'Submit Review'
                }
              </button>
            </form>

            {success && (
              <div style={{ marginTop: '1rem', padding: '0.9rem', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
                <i className="fa-solid fa-check-circle" style={{ marginRight: '0.4rem' }} />
                Thank you! Your review has been published successfully.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}