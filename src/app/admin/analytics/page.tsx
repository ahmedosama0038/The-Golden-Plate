'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TopBar from '@/components/admin/TopBar'
import { orderApi } from '@/lib/api'
import type { ApiOrder } from '@/types'

const CURRENCY = 'ج.م'

type Period = 'today' | '7' | '30' | 'all'
const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7', label: '7 Days' },
  { key: '30', label: '30 Days' },
  { key: 'all', label: 'All Time' },
]

const TYPE_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  reservation: 'Reservation',
  takeaway: 'Takeaway',
  dine_in: 'Dine-in',
}

// الإيراد من الطلبات المكتملة بس (نفس قاعدة الداشبورد)
const isPaid = (o: ApiOrder) => o.status === 'delivered' || o.status === 'completed'

// created_at بتتخزن UTC من غير Z
const parseApiDate = (s: string) => new Date(s.replace(' ', 'T') + 'Z')

const money = (n: number) => `${Math.round(n).toLocaleString('en-US')} ${CURRENCY}`

const card: React.CSSProperties = {
  background: 'var(--adm-surface, #1e1e1e)',
  border: '1px solid var(--adm-border, #333)',
  borderRadius: 12,
  padding: '1.2rem',
}

function Bar({ label, value, max, right }: { label: string; value: number; max: number; right: string }) {
  return (
    <div style={{ marginBottom: '0.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4, gap: 8 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ color: 'var(--adm-muted)', whiteSpace: 'nowrap' }}>{right}</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
        <div
          style={{
            height: '100%',
            width: `${max > 0 ? Math.max((value / max) * 100, 3) : 0}%`,
            borderRadius: 4,
            background: 'var(--adm-gold)',
          }}
        />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('7')

  // نفس queryKey بتاع باقي صفحات الأدمن، فالطلب بيتشارك
  const { data: orders = [], isLoading } = useQuery<ApiOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: orderApi.getAll,
    refetchInterval: 30_000,
  })

  const inRange = useMemo(() => {
    if (period === 'all') return orders
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - (period === 'today' ? 0 : Number(period) - 1))
    return orders.filter((o) => parseApiDate(o.created_at) >= start)
  }, [orders, period])

  const stats = useMemo(() => {
    const paid = inRange.filter(isPaid)
    const revenue = paid.reduce((s, o) => s + Number(o.total_price), 0)
    const withValue = paid.filter((o) => Number(o.total_price) > 0)
    return {
      revenue,
      orders: inRange.length,
      paid: paid.length,
      cancelled: inRange.filter((o) => o.status === 'cancelled').length,
      avg: withValue.length ? revenue / withValue.length : 0,
    }
  }, [inRange])

  // أكتر الأصناف مبيعاً (من الطلبات غير الملغية)
  const topItems = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number }>()
    inRange
      .filter((o) => o.status !== 'cancelled')
      .forEach((o) =>
        o.items.forEach((i) => {
          const cur = map.get(i.product_name) ?? { qty: 0, revenue: 0 }
          cur.qty += i.quantity
          cur.revenue += Number(i.subtotal)
          map.set(i.product_name, cur)
        })
      )
    return [...map.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6)
  }, [inRange])

  // أوقات الذروة (بتوقيت جهازك، من الطلبات غير الملغية)
  const hours = useMemo(() => {
    const arr = Array.from({ length: 24 }, (_, h) => ({ h, count: 0 }))
    inRange
      .filter((o) => o.status !== 'cancelled')
      .forEach((o) => {
        arr[parseApiDate(o.created_at).getHours()].count += 1
      })
    return arr
  }, [inRange])
  const maxHour = Math.max(...hours.map((x) => x.count), 1)
  const peak = hours.reduce((a, b) => (b.count > a.count ? b : a), hours[0])

  // تقسيم حسب النوع (أي نوع ريم تضيفه هيظهر لوحده)
  const byType = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>()
    inRange.forEach((o) => {
      const cur = map.get(o.order_type) ?? { count: 0, revenue: 0 }
      cur.count += 1
      if (isPaid(o)) cur.revenue += Number(o.total_price)
      map.set(o.order_type, cur)
    })
    return [...map.entries()].map(([type, v]) => ({ type, ...v })).sort((a, b) => b.count - a.count)
  }, [inRange])

  // تقسيم حسب الحالة
  const byStatus = useMemo(() => {
    const map = new Map<string, number>()
    inRange.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1))
    return [...map.entries()].map(([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count)
  }, [inRange])

  const dash = (v: string) => (isLoading ? '…' : v)

  const STATS = [
    { label: 'Revenue', value: dash(money(stats.revenue)), change: `${stats.paid} completed orders`, icon: 'fa-solid fa-sack-dollar' },
    { label: 'Orders', value: dash(String(stats.orders)), change: `${stats.cancelled} cancelled`, icon: 'fa-solid fa-cart-shopping' },
    { label: 'Avg. Order Value', value: dash(money(stats.avg)), change: 'completed orders with items', icon: 'fa-solid fa-receipt' },
    {
      label: 'Peak Hour',
      value: dash(peak.count > 0 ? `${String(peak.h).padStart(2, '0')}:00` : '—'),
      change: peak.count > 0 ? `${peak.count} orders` : 'no data yet',
      icon: 'fa-solid fa-clock',
    },
  ]

  return (
    <>
      <TopBar title="Analytics" />
      <div className="adm-content">

        {/* الفترة */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className="adm-btn ghost"
              style={{
                fontSize: '0.72rem',
                borderColor: period === p.key ? 'var(--adm-gold)' : undefined,
                color: period === p.key ? 'var(--adm-gold)' : undefined,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* الكاردات */}
        <div className="adm-stats-grid-v2">
          {STATS.map((s) => (
            <div key={s.label} className="adm-stat-card-v2">
              <div className="stat-card-header">
                <div className="stat-icon-box"><i className={s.icon} /></div>
              </div>
              <div className="stat-card-body">
                <p className="stat-value-v2">{s.value}</p>
                <h3 className="stat-label-v2">{s.label}</h3>
                <span className="stat-change-v2 up">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.2rem',
            marginTop: '1.2rem',
          }}
        >
          {/* أكتر الأصناف مبيعاً */}
          <div style={card}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Top Selling Items</h2>
            {topItems.length === 0 ? (
              <p style={{ color: 'var(--adm-muted)', fontSize: '0.85rem' }}>No items in this period.</p>
            ) : (
              topItems.map((i) => (
                <Bar
                  key={i.name}
                  label={i.name}
                  value={i.qty}
                  max={topItems[0].qty}
                  right={`${i.qty} sold · ${money(i.revenue)}`}
                />
              ))
            )}
          </div>

          {/* تقسيم حسب النوع */}
          <div style={card}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Orders by Type</h2>
            {byType.length === 0 ? (
              <p style={{ color: 'var(--adm-muted)', fontSize: '0.85rem' }}>No orders in this period.</p>
            ) : (
              byType.map((t) => (
                <Bar
                  key={t.type}
                  label={TYPE_LABELS[t.type] ?? t.type}
                  value={t.count}
                  max={byType[0].count}
                  right={`${t.count} · ${money(t.revenue)}`}
                />
              ))
            )}

            <h2 style={{ fontSize: '1rem', margin: '1.4rem 0 1rem' }}>Orders by Status</h2>
            {byStatus.map((s) => (
              <Bar
                key={s.status}
                label={s.status}
                value={s.count}
                max={byStatus[0].count}
                right={String(s.count)}
              />
            ))}
          </div>
        </div>

        {/* أوقات الذروة */}
        <div style={{ ...card, marginTop: '1.2rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Peak Hours</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 140 }}>
            {hours.map((x) => (
              <div
                key={x.h}
                title={`${String(x.h).padStart(2, '0')}:00 — ${x.count} orders`}
                style={{
                  flex: 1,
                  height: x.count > 0 ? `${Math.max((x.count / maxHour) * 100, 4)}%` : '2%',
                  background: x.count > 0 ? 'var(--adm-gold)' : 'rgba(255,255,255,0.08)',
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
            {hours.map((x) => (
              <span
                key={x.h}
                style={{ flex: 1, textAlign: 'center', fontSize: '0.6rem', color: 'var(--adm-muted)' }}
              >
                {x.h % 3 === 0 ? x.h : ''}
              </span>
            ))}
          </div>
          <p style={{ color: 'var(--adm-muted)', fontSize: '0.72rem', marginTop: '0.8rem' }}>
            Hours are in your device time. Cancelled orders are excluded.
          </p>
        </div>

      </div>
    </>
  )
}