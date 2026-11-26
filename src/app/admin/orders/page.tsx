// ============================================================
//  admin/orders/page.tsx — طلبات الدليفري (من باك )
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

export default function OrdersPage() {
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
        'Cancel Order',
        `إلغاء الطلب #${order.id}؟`,
        () => statusMutation.mutate({ id: order.id, status })
      )
      return
    }
    statusMutation.mutate({ id: order.id, status })
  }

  const deliveryOrders = orders
    .filter((o) => o.order_type === 'delivery')
    .sort((a, b) => b.id - a.id)

  const filtered = deliveryOrders.filter(
    (o) => filter === 'all' || o.status === filter
  )

  return (
    <>
      <TopBar title="Orders" />
      <div className="adm-content">

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          {ALL_FILTERS.map((s) => {
            const count =
              s === 'all'
                ? deliveryOrders.length
                : deliveryOrders.filter((o) => o.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="adm-btn ghost"
                style={{
                  fontSize: '0.72rem',
                  borderColor: filter === s ? 'var(--adm-gold)' : undefined,
                  color: filter === s ? 'var(--adm-gold)' : undefined,
                  textTransform: 'capitalize',
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
            <p>Loading orders...</p>
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
              <div className="adm-table-title">
                Delivery Orders{' '}
                <span style={{ color: 'var(--adm-muted)', fontSize: '0.8rem', fontFamily: 'Montserrat' }}>
                  ({filtered.length})
                </span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{order.id}</td>
                    <td style={{ fontWeight: 600 }}>{order.customer.name}</td>
                    <td style={{ color: 'var(--adm-muted)' }}>{order.customer.phone}</td>
                    <td style={{ color: 'var(--adm-muted)', maxWidth: '180px' }}>
                      {order.address ?? '—'}
                    </td>
                    <td style={{ color: 'var(--adm-muted)', maxWidth: '240px' }}>
                     {order.items.map((i) => (
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
                      {order.notes && (
                        <div style={{ fontSize: '0.72rem', marginTop: '0.3rem', opacity: 0.8 }}>
                          📝 {order.notes}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {order.total_price} {CURRENCY}
                    </td>
                    <td>
                      <span className={`adm-badge ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value as ApiOrderStatus)
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
                        onClick={() => openCustomerWhatsApp(order)}
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
                    <td style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>
                      {order.created_at.slice(0, 16)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="adm-empty">
                <i className="fa-solid fa-bag-shopping" />
                <p>No orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}