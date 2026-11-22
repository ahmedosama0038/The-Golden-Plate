'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi, reviewApi } from '@/lib/api'
import { toast } from '@/lib/toast'
import { useLang } from '@/lib/i18n'
import type { ApiOrder } from '@/types'

const PHONE_RE = /^01[0125][0-9]{8}$/

interface Props {
  onDone?: () => void
}

export default function ReviewForm({ onDone }: Props) {
  const queryClient = useQueryClient()
  const { t, lang } = useLang()

  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<ApiOrder[] | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  // الطلبات اللي تستاهل تقييم: can_review ولسه ما اتقيّمتش
  const eligible = (orders ?? []).filter((o) => o.can_review && !o.is_reviewed)
  const alreadyReviewed = (orders ?? []).filter((o) => o.is_reviewed).length

  // رسالة الخطأ: 5xx أو من غير رد = الخدمة مشغولة، غير كده رسالة الباك أو احتياطية
  const getErrMessage = (err: any, fallback: string) => {
    const status = err?.response?.status
    if (!status || status >= 500) return t('rv.err.busy')
    return err?.response?.data?.message ?? fallback
  }

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
      console.error('track failed:', err?.response?.status, err?.response?.data ?? err)
      setError(getErrMessage(err, t('rv.err.fetch')))
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
      toast.success(t('rv.thanks'))
      onDone?.()
    },
    onError: (err: any) => {
      console.error('review failed:', err?.response?.status, err?.response?.data ?? err)
      setError(getErrMessage(err, t('rv.err.submit')))
    },
  })

  const handleFind = () => {
    setError('')
    if (!PHONE_RE.test(phone)) {
      setError(t('err.phone'))
      return
    }
    findOrders.mutate(phone)
  }

  const handleSubmit = () => {
    setError('')
    if (!selectedId) return setError(t('rv.err.order'))
    if (rating < 1) return setError(t('rv.err.rating'))
    if (comment.trim().length < 10) return setError(t('rv.err.comment'))
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
    const type = o.order_type === 'delivery' ? t('rv.delivery') : t('rv.reservation')
    const sep = lang === 'ar' ? '، ' : ', '
    const what =
      o.items.length > 0
        ? o.items.map((i) => `${i.product_name} x${i.quantity}`).join(sep)
        : o.date_only ?? ''
    return `#${o.id} — ${type} — ${what}`
  }

  return (
    <div className="review-form" style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* ── الخطوة 1: التليفون ── */}
      {orders === null && (
        <>
          <div className="co-field">
            <label htmlFor="rv-phone">{t('rv.phoneLabel')}</label>
            <input
              id="rv-phone"
              type="tel"
              dir="ltr"
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
            {findOrders.isPending ? t('rv.searching') : t('rv.search')}
          </button>
        </>
      )}

      {/* ── مفيش طلبات تستاهل تقييم ── */}
      {orders !== null && eligible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <p>{alreadyReviewed > 0 ? t('rv.allReviewed') : t('rv.noEligible')}</p>
          <button type="button" className="btn-outline" onClick={changePhone}>
            {t('rv.changePhone')}
          </button>
        </div>
      )}

      {/* ── الخطوة 2: التقييم ── */}
      {orders !== null && eligible.length > 0 && (
        <>
          <div className="co-field">
            <label htmlFor="rv-order">{t('rv.chooseOrder')}</label>
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
            <label>{t('rv.rating')}</label>
            <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.8rem' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} / 5`}
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
            <label htmlFor="rv-comment">{t('rv.comment')}</label>
            <textarea
              id="rv-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-outline" onClick={changePhone}>
              {t('rv.changePhone')}
            </button>
            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitReview.isPending}
              style={{ flex: 1 }}
            >
              {submitReview.isPending ? t('rv.submitting') : t('rv.submit')}
            </button>
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