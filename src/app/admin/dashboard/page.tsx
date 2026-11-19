'use client'

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import TopBar from '@/components/admin/TopBar'
import { orderApi, reviewApi } from '@/lib/api'
import type { ApiOrder } from '@/types'

const CURRENCY = 'ج.م'

// الإيراد بيتحسب من الطلبات المكتملة بس
const isPaid = (o: ApiOrder) => o.status === 'delivered' || o.status === 'completed'

// ريم بتخزن الوقت UTC من غير Z، فبنحوّله لتوقيت جهازك
const parseApiDate = (s: string) => new Date(s.replace(' ', 'T') + 'Z')

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const money = (n: number) => `${n.toLocaleString('en-US')} ${CURRENCY}`

export default function DashboardPage() {
  // التاريخ بيتحط بعد الـ mount عشان ما يحصلش Hydration mismatch
  const [today, setToday] = useState('')
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    )
  }, [])

  // نفس queryKey بتاع Orders وReservations، فالطلب بيتشارك
  const { data: orders = [], isLoading } = useQuery<ApiOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: orderApi.getAll,
    refetchInterval: 30_000,
  })

  const { data: reviewsRaw = [] } = useQuery<any[]>({
    queryKey: ['dashboard-reviews'],
    queryFn: reviewApi.getAll,
  })
  const reviews = Array.isArray(reviewsRaw) ? reviewsRaw : []

  // ── الأرقام ──
  const totals = useMemo(() => {
    const paid = orders.filter(isPaid)
    return {
      paidCount: paid.length,
      revenue: paid.reduce((s, o) => s + Number(o.total_price), 0),
      dishes: paid.reduce(
        (s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0),
        0
      ),
      pending: orders.filter((o) => o.status === 'pending').length,
    }
  }, [orders])

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0'

  // ── مبيعات آخر 7 أيام ──
  const weekly = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (6 - i))
      return {
        key: dayKey(d),
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: 0,
      }
    })

    orders.filter(isPaid).forEach((o) => {
      const day = days.find((d) => d.key === dayKey(parseApiDate(o.created_at)))
      if (day) day.amount += Number(o.total_price)
    })

    const max = Math.max(...days.map((d) => d.amount), 1)
    return days.map((d) => ({
      ...d,
      height: d.amount > 0 ? `${Math.max((d.amount / max) * 100, 4)}%` : '2%',
    }))
  }, [orders])

  // ── آخر 5 طلبات (دليفري وحجز) ──
  const recent = useMemo(
    () => [...orders].sort((a, b) => b.id - a.id).slice(0, 5),
    [orders]
  )

  const dash = (v: string) => (isLoading ? '…' : v)

  const STATS = [
    {
      label: 'Total Revenue',
      value: dash(money(totals.revenue)),
      change: `${totals.paidCount} completed orders`,
      icon: 'fa-solid fa-sack-dollar',
    },
    {
      label: 'Total Orders',
      value: dash(String(orders.length)),
   change: `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`,
      icon: 'fa-solid fa-cart-shopping',
    },
    {
      label: 'Dishes Served',
      value: dash(totals.dishes.toLocaleString('en-US')),
      change: `from ${totals.paidCount} orders`,
      icon: 'fa-solid fa-utensils',
    },
    {
      label: 'Customer Rating',
      value: avgRating,
      change: `${reviews.length} reviews`,
      icon: 'fa-solid fa-star',
    },
  ]

  return (
    <>
      <TopBar title="Dashboard Overview" subtitle={today} />

      <div className="adm-content">

        {/* 📊 1. الكاردات الإحصائية */}
        <div className="adm-stats-grid-v2">
          {STATS.map((stat) => (
            <div key={stat.label} className="adm-stat-card-v2">
              <div className="stat-card-header">
                <div className="stat-icon-box">
                  <i className={stat.icon} />
                </div>
              </div>
              <div className="stat-card-body">
                <p className="stat-value-v2">{stat.value}</p>
                <h3 className="stat-label-v2">{stat.label}</h3>
                <span className="stat-change-v2 up">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 📈 2. مبيعات آخر 7 أيام */}
        <div className="adm-chart-section">
          <div className="chart-header-row">
            <h2>Sales — Last 7 Days</h2>
            <span style={{ color: 'var(--adm-muted)', fontSize: '0.8rem' }}>
              Delivered & completed only
            </span>
          </div>

          <div className="adm-bar-chart-container">
            <div className="bars-wrapper">
              {weekly.map((day) => (
                <div key={day.key} className="bar-column">
                  <div className="bar-tooltip">{money(day.amount)}</div>
                  <div className="bar-actual-fill" style={{ height: day.height }} />
                  <span className="bar-day-label">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📑 3. آخر الطلبات */}
        <div className="adm-dashboard-section-v2">
          <div className="section-header-row">
            <h2>Recent Orders</h2>
            <a href="/admin/orders" className="view-all-link">View All</a>
          </div>

          <div className="adm-table-wrap-v2">
            <table className="adm-table-v2">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id} className="adm-table-row-v2">
                    <td className="order-id-cell">#{order.id}</td>
                    <td style={{ textTransform: 'capitalize' }}>{order.order_type}</td>
                    <td className="customer-cell">{order.customer.name}</td>
                    <td className="items-cell">
                      {order.items.length > 0
                        ? order.items
                            .map((i) => `${i.product_name} x${i.quantity}`)
                            .join(', ')
                        : '—'}
                    </td>
                    <td className="total-cell">{money(Number(order.total_price))}</td>
                    <td>
                      <span className={`adm-status-v2 ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {!isLoading && recent.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}