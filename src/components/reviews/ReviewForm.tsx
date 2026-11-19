'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi, reviewApi } from '@/lib/api'
import { reviewSchema } from '@/lib/schemas'
import { toast } from '@/lib/toast'
import type { ApiOrder } from '@/types'

const PHONE_RE = /^01[0125][0-9]{8}$/

interface Props {
  onDone?: () => void
}

export default function ReviewForm({ onDone }: Props) {
  const queryClient = useQueryClient()

  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<ApiOrder[] | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  // الطلبات اللي تستاهل تقييم: مكتملة ولسه ما اتقيّمتش
  const eligible = (orders ?? []).filter((o) => o.can_review && !o.is_reviewed)
  const alreadyReviewed = (orders ?? []).filter((o) => o.is_reviewed).length

  // ── 1) هات طلبات العميل بالتليفون ──
  const findOrders = useMutation({
    mutationFn: (p: string) => orderApi.track(p),
    onSuccess: (data) => {
      const list: ApiOrder[] = Array.isArray(data) ? data : []
      setOrders(list)
      const first = list.find((o) => o.can_review && !o.is_reviewed)
      setSelectedId(first ? first.id : null)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'تعذر جلب الطلبات، حاول تاني')
    },
  })

  // ── 2) ابعت التقييم ──
  const submitReview = useMutation({
    mutationFn: () =>
      reviewApi.create({
        order_id: selectedId as number,
        customerPhone: phone,
        rating,
        comment: comment.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-reviews'] })
      toast.success('شكراً لتقييمك!')
      onDone?.()
    },
   onError: (err: any) => {
  const status = err?.response?.status
  console.error('track failed:', status, err?.response?.data ?? err)
  setError(
    status >= 500 || !status
      ? 'الخدمة مشغولة حالياً، جرّب بعد شوية'
      : err?.response?.data?.message ?? 'تعذر جلب الطلبات'
  )
},
  })

  const handleFind = () => {
    setError('')
    if (!PHONE_RE.test(phone)) {
      setError('رقم تليفون مصري غير صحيح')
      return
    }
    findOrders.mutate(phone)
  }

  const handleSubmit = () => {
    setError('')
    const parsed = reviewSchema.safeParse({
      order_id: selectedId,
      customerPhone: phone,
      rating,
      comment,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    submitReview.mutate()
  }

  const changePhone = () => {
    setOrders(null)
    setSelectedId(null)
    setRating(0)
    setComment('')
    setError('')
  }

  const orderLabel = (o: ApiOrder) => {
    const type = o.order_type === 'delivery' ? 'دليفري' : 'حجز'
    const what =
      o.items.length > 0
        ? o.items.map((i) => `${i.product_name} x${i.quantity}`).join('، ')
        : o.date_only ?? ''
    return `#${o.id} — ${type} — ${what}`
  }

  return (
    <div className="review-form" style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* ── الخطوة 1: التليفون ── */}
      {orders === null && (
        <>
          <div className="co-field">
            <label htmlFor="rv-phone">رقم التليفون اللي طلبت بيه</label>
            <input
              id="rv-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
            />
          </div>
         <button
  type="button"
  className="submit-btn"
  onClick={handleFind}
  disabled={findOrders.isPending}
>
  {findOrders.isPending ? 'جاري البحث...' : 'ابحث عن طلباتي'}
</button>
        </>
      )}

      {/* ── مفيش طلبات تستاهل تقييم ── */}
      {orders !== null && eligible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <p>
            {alreadyReviewed > 0
              ? 'إنت قيّمت كل طلباتك المكتملة، شكراً ليك!'
              : 'مفيش طلبات مكتملة تقدر تقيّمها لسه. التقييم بيفتح لما طلبك أو حجزك يخلص.'}
          </p>
          <button type="button" className="btn-secondary" onClick={changePhone}>
            رقم تاني
          </button>
        </div>
      )}

      {/* ── الخطوة 2: التقييم ── */}
      {orders !== null && eligible.length > 0 && (
        <>
          <div className="co-field">
            <label htmlFor="rv-order">اختار الطلب</label>
            <select
              id="rv-order"
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                color: 'inherit',
                padding: '0.7rem 0.9rem',
                fontFamily: 'inherit',
              }}
            >
              {eligible.map((o) => (
                <option key={o.id} value={o.id}>
                  {orderLabel(o)}
                </option>
              ))}
            </select>
          </div>

          <div className="co-field">
            <label>تقييمك</label>
            <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.8rem' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: n <= rating ? 'var(--gold, #d4af37)' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="co-field">
            <label htmlFor="rv-comment">رأيك (10 حروف على الأقل)</label>
            <textarea
              id="rv-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="checkout-actions">
            <button type="button" className="btn-outline" onClick={changePhone}>
  رقم تاني
</button>
           <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
  <button type="button" className="btn-outline" onClick={changePhone}>
    رقم تاني
  </button>
  <button
    type="button"
    className="submit-btn"
    onClick={handleSubmit}
    disabled={submitReview.isPending}
    style={{ flex: 1 }}
  >
    {submitReview.isPending ? 'جاري الإرسال...' : 'أرسل التقييم'}
  </button>
</div>
          </div>
        </>
      )}

      {error && (
        <p className="co-error-text" style={{ marginTop: '0.8rem' }}>
          {error}
        </p>
      )}
    </div>
  )
}