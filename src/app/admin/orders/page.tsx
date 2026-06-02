
// ============================================================
//  admin/orders/page.tsx
// ============================================================
'use client'

import { useState } from 'react'
import TopBar from '@/components/admin/TopBar'

const MOCK_ORDERS = [
  { id: '#1042', customer: 'James M.',   phone: '+1 212 555 0101', items: 'Wagyu + Scallops',          total: '$113', status: 'confirmed',  time: '2026-05-17 20:10' },
  { id: '#1041', customer: 'Sophia L.',  phone: '+1 212 555 0102', items: 'Sea Bass + Wine (Glass)',    total: '$70',  status: 'preparing',  time: '2026-05-17 20:03' },
  { id: '#1040', customer: 'Yuki N.',    phone: '+1 212 555 0103', items: 'Truffle Arancini x2',        total: '$36',  status: 'ready',      time: '2026-05-17 19:56' },
  { id: '#1039', customer: 'Marcus T.',  phone: '+1 212 555 0104', items: 'Chocolate Sphere',           total: '$19',  status: 'delivered',  time: '2026-05-17 19:10' },
  { id: '#1038', customer: 'Amelia S.',  phone: '+1 212 555 0105', items: 'Duck Confit + Soufflé',      total: '$61',  status: 'delivered',  time: '2026-05-17 18:45' },
  { id: '#1037', customer: 'Oliver K.',  phone: '+1 212 555 0106', items: 'Foie Gras + Cold Brew',      total: '$41',  status: 'cancelled',  time: '2026-05-17 18:20' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'yellow', confirmed: 'blue', preparing: 'yellow',
  ready: 'green', delivered: 'gold', cancelled: 'red',
}

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

export default function OrdersPage() {
  const [filter, setFilter] = useState('all')

  const filtered = MOCK_ORDERS.filter((o) => filter === 'all' || o.status === filter)

  return (
    <>
      <TopBar title="Orders" />
      <div className="adm-content">

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          {ALL_STATUSES.map((s) => (
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
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="adm-table-wrap">
          <div className="adm-table-header">
            <div className="adm-table-title">
              Orders <span style={{ color: 'var(--adm-muted)', fontSize: '0.8rem', fontFamily: 'Montserrat' }}>({filtered.length})</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customer}</td>
                  <td style={{ color: 'var(--adm-muted)' }}>{order.phone}</td>
                  <td style={{ color: 'var(--adm-muted)', maxWidth: '180px' }}>{order.items}</td>
                  <td style={{ fontWeight: 700 }}>{order.total}</td>
                  <td>
                    <span className={`adm-badge ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>{order.time}</td>
                  <td>
                    <button className="adm-btn ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.7rem' }}>
                      <i className="fa-solid fa-pen" />
                    </button>
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
      </div>
    </>
  )
}