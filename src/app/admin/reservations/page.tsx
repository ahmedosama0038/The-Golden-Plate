//  admin/reservations/page.tsx — حجوزات الطاولات (من باك )
// ============================================================
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import TopBar from '@/components/admin/TopBar'
import { orderApi } from '@/lib/api'
import { toast } from '@/lib/toast'
import { openCustomerWhatsApp } from '@/lib/adminWhatsApp'
import type { ApiOrder, ApiOrderStatus } from '@/types'

const CURRENCY = 'ج.م'

const STATUS_COLORS: Record<ApiOrderStatus, string> = {
  pending: 'yellow',
  preparing: 'blue',
  delivered: 'green',
  completed: 'gold',
  cancelled: 'red',
}

const STATUSES: ApiOrderStatus[] = [
  'pending', 'preparing', 'delivered', 'completed', 'cancelled',
]
const ALL_FILTERS: ('all' | ApiOrderStatus)[] = ['all', ...STATUSES]

export default function ReservationsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<'all' | ApiOrderStatus>('all')

  const { data: orders = [], isLoading, isError, error } = useQuery<ApiOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: orderApi.getAll,
    refetchInterval: 30_000,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApiOrderStatus }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('تم تحديث الحالة')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'تعذر تحديث الحالة')
    },
  })

  const handleStatusChange = (order: ApiOrder, status: ApiOrderStatus) => {
    if (status === order.status) return

    if (status === 'cancelled') {
      toast.confirm(
        'Cancel Reservation',
        `إلغاء الحجز #${order.id}؟`,
        () => statusMutation.mutate({ id: order.id, status })
      )
      return
    }
    statusMutation.mutate({ id: order.id, status })
  }

  const reservations = orders
    .filter((o) => o.order_type === 'reservation')
    .sort((a, b) => b.id - a.id)

  const filtered = reservations.filter(
    (r) => filter === 'all' || r.status === filter
  )

  return (
    <>
      <TopBar title="Reservations" />
      <div className="adm-content">

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          {ALL_FILTERS.map((s) => {
            const count =
              s === 'all'
                ? reservations.length
                : reservations.filter((r) => r.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="adm-btn ghost"
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'capitalize',
                  borderColor: filter === s ? 'var(--adm-gold)' : undefined,
                  color: filter === s ? 'var(--adm-gold)' : undefined,
                }}
              >
                {s} ({count})
              </button>
            )
          })}
        </div>

        {isLoading && (
          <div className="adm-loading-state">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading reservations...</p>
          </div>
        )}

        {isError && (
          <div className="adm-empty">
            <i className="fa-solid fa-triangle-exclamation" />
            <p>{(error as Error).message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              <div className="adm-table-title">Reservations ({filtered.length})</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Pre-order</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{r.customer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                        {r.customer.phone}
                      </div>
                    </td>
                    <td>{r.date_only ?? '—'}</td>
                    <td style={{ letterSpacing: '0.5px' }}>
                      {r.time_only ? r.time_only.slice(0, 5) : '—'}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--adm-gold)' }}>
                      {r.number_of_guests ?? '—'}
                    </td>
                    <td style={{ color: 'var(--adm-muted)', fontSize: '0.78rem', maxWidth: '220px' }}>
                      {r.items.length === 0 ? (
                        '—'
                      ) : (
                        <>
                          {r.items.map((i) => (
                            <div key={i.id}>
                              {i.product_name}
                              {i.size_name ? ` (${i.size_name})` : ''} x{i.quantity}
                              {i.extras && i.extras.length > 0 && (
                                <div style={{ fontSize: '0.72rem', opacity: 0.8, paddingInlineStart: '0.6rem' }}>
                                  + {i.extras
                                    .map((e) => e.name + (e.size_name ? ` (${e.size_name})` : ''))
                                    .join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                          <div style={{ marginTop: '0.25rem', fontWeight: 600 }}>
                            {r.total_price} {CURRENCY}
                          </div>
                        </>
                      )}
                    </td>
                    <td
                      style={{
                        color: 'var(--adm-muted)',
                        fontSize: '0.75rem',
                        maxWidth: '200px',
                      }}
                    >
                      {r.notes ?? '—'}
                    </td>
                    <td>
                      <span className={`adm-badge ${STATUS_COLORS[r.status]}`}>
                        {r.status}
                      </span>
                      <select
                        value={r.status}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          handleStatusChange(r, e.target.value as ApiOrderStatus)
                        }
                        style={{
                          display: 'block',
                          marginTop: '0.4rem',
                          background: 'var(--adm-bg)',
                          border: '1px solid var(--adm-border)',
                          borderRadius: '6px',
                          color: 'var(--adm-text)',
                          padding: '0.25rem 0.4rem',
                          fontSize: '0.72rem',
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => openCustomerWhatsApp(r)}
                        style={{
                          display: 'block',
                          marginTop: '0.4rem',
                          background: '#25D366',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <i className="fa-brands fa-whatsapp" /> WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="adm-empty">
                <i className="fa-solid fa-calendar-days" />
                <p>No reservations found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}