'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/lib/api'
import { useLang, type DictKey } from '@/lib/i18n'
import type { ApiOrder } from '@/types'

const PHONE_RE = /^01[0125][0-9]{8}$/

// 0 = استلمنا، 1 = بنجهّز، 2 = خلص (delivered أو completed)
const stepIndex = (status: string) =>
  status === 'delivered' || status === 'completed' ? 2 : status === 'preparing' ? 1 : 0

function OrderCard({ order }: { order: ApiOrder }) {
  const { t, lang } = useLang()
  const cancelled = order.status === 'cancelled'
  const current = stepIndex(order.status)
  const finalKey: DictKey =
    order.order_type === 'reservation' ? 'trk.s.completed' : 'trk.s.delivered'
  const steps: DictKey[] = ['trk.s.pending', 'trk.s.preparing', finalKey]

  // created_at بتتخزن UTC من غير timezone
  const created = new Date(order.created_at.replace(' ', 'T') + 'Z')
  const when = created.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="trk-card">
      <div className="trk-head">
        <strong>
          {t('trk.order')} #{order.id}
        </strong>
        <span className="trk-type">
          {order.order_type === 'delivery' ? t('rv.delivery') : t('rv.reservation')}
        </span>
      </div>
      <div className="trk-when">{when}</div>

      {cancelled ? (
        <div className="trk-cancelled">{t('trk.cancelled')}</div>
      ) : (
        <div className="trk-steps">
          {steps.map((key, i) => (
            <div key={key} className="trk-step-wrap">
              {i > 0 && <div className={`trk-line${i <= current ? ' on' : ''}`} />}
              <div className={`trk-step${i < current ? ' done' : ''}${i === current ? ' now' : ''}`}>
                <div className="trk-dot">
                  {i <= current && <i className="fa-solid fa-check" />}
                </div>
                <span>{t(key)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ul className="trk-items">
        {order.items.map((it) => (
          <li key={it.id}>
            {it.product_name}
            {it.size_name ? ` (${it.size_name})` : ''} × {it.quantity}
          </li>
        ))}
        {order.order_type === 'reservation' && order.number_of_guests && (
          <li>
            {order.number_of_guests} {t('trk.guests')} — {order.date_only} {order.time_only?.slice(0, 5)}
          </li>
        )}
      </ul>

      {order.items.length > 0 && (
        <div className="trk-total">
          {t('cart.total')}: {order.total_price} {t('currency')}
        </div>
      )}
    </div>
  )
}

export default function TrackClient() {
  const { t } = useLang()
  const [input, setInput] = useState('')
  const [phone, setPhone] = useState('')
  const [formError, setFormError] = useState('')

  // لو جاي من زرار "تابع طلبك": الرقم في الـ URL، ابحث لوحدك
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('phone')
    if (p && PHONE_RE.test(p)) {
      setInput(p)
      setPhone(p)
    }
  }, [])

  const { data, isFetching, isError, error } = useQuery<ApiOrder[]>({
    queryKey: ['track', phone],
    queryFn: async () => {
      const res = await orderApi.track(phone)
      return Array.isArray(res) ? res : []
    },
    enabled: phone !== '',
    refetchInterval: 30000,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!PHONE_RE.test(input)) {
      setFormError(t('err.phone'))
      return
    }
    setFormError('')
    setPhone(input)
  }

  const status = (error as any)?.response?.status
  const errText = isError
    ? !status || status >= 500
      ? t('rv.err.busy')
      : (error as any)?.response?.data?.message ?? t('rv.err.fetch')
    : ''

  const orders = [...(data ?? [])].sort((a, b) => b.id - a.id)

  return (
    <>
      <section className="hero hero-sm">
        <div className="hero-content">
          <h1>
            {t('trk.title1')} <span>{t('trk.title2')}</span>
          </h1>
          <p>{t('trk.subtitle')}</p>
        </div>
      </section>

      <div className="trk-wrap">
        <form onSubmit={submit} className="trk-form">
          <input
            type="tel"
            dir="ltr"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="01xxxxxxxxx"
          />
          <button type="submit" className="submit-btn" disabled={isFetching}>
            {isFetching && !data ? t('trk.searching') : t('trk.search')}
          </button>
        </form>

        {(formError || errText) && <p className="co-error-text">{formError || errText}</p>}

        {phone && data && orders.length === 0 && !isError && (
          <p className="trk-empty">{t('trk.none')}</p>
        )}

        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}

        {orders.length > 0 && <p className="trk-auto">{t('trk.auto')}</p>}
      </div>
    </>
  )
}