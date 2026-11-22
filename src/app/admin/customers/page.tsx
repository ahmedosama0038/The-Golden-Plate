'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TopBar from '@/components/admin/TopBar'
import { customerApi } from '@/lib/api'
import { toWaNumber } from '@/lib/adminWhatsApp'

interface Customer {
  id: number
  name: string
  phone: string
  last_address: string | null
  orders_count: number
  total_spent: number
  joined_at: string
}

type Sort = 'spent' | 'orders' | 'newest'

const SORTS: { key: Sort; label: string }[] = [
  { key: 'spent', label: 'Top spenders' },
  { key: 'orders', label: 'Most orders' },
  { key: 'newest', label: 'Newest' },
]

const money = (n: number) => `${Math.round(n).toLocaleString('en-US')} ج.م`

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort>('spent')

  const { data: customers = [], isLoading, isError, error } = useQuery<Customer[]>({
    queryKey: ['admin-customers'],
    queryFn: () => customerApi.getAll(),
    refetchInterval: 60_000,
  })

  const stats = useMemo(() => {
    const total = customers.length
    const spent = customers.reduce((s, c) => s + Number(c.total_spent), 0)
    const repeat = customers.filter((c) => c.orders_count > 1).length
    return {
      total,
      spent,
      repeat,
      avg: total ? spent / total : 0,
    }
  }, [customers])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = customers.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q)
    )
    return [...list].sort((a, b) =>
      sort === 'spent'
        ? Number(b.total_spent) - Number(a.total_spent)
        : sort === 'orders'
        ? b.orders_count - a.orders_count
        : b.joined_at.localeCompare(a.joined_at) || b.id - a.id
    )
  }, [customers, search, sort])

  const STATS = [
    { label: 'Customers', value: isLoading ? '…' : String(stats.total), change: `${stats.repeat} returning`, icon: 'fa-solid fa-users' },
    { label: 'Total Spent', value: isLoading ? '…' : money(stats.spent), change: 'all customers', icon: 'fa-solid fa-sack-dollar' },
    { label: 'Avg. per Customer', value: isLoading ? '…' : money(stats.avg), change: 'lifetime value', icon: 'fa-solid fa-receipt' },
    {
      label: 'Returning Rate',
      value: isLoading || !stats.total ? '…' : `${Math.round((stats.repeat / stats.total) * 100)}%`,
      change: 'ordered more than once',
      icon: 'fa-solid fa-rotate',
    },
  ]

  return (
    <>
      <TopBar title="Customers" subtitle="Everyone who ordered or booked a table." />

      <div className="adm-content">

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

        {/* البحث والترتيب */}
        <div className="adm-toolbar" style={{ marginTop: '1.2rem' }}>
          <div className="adm-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="adm-input-search"
            />
          </div>

          <div className="adm-filter-group">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`adm-btn-tab ${sort === s.key ? 'active' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="adm-loading-state">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading customers...</p>
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
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Last Address</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="adm-table-row">
                    <td style={{ fontWeight: 600 }}>
                      {c.name}
                      {c.orders_count > 1 && (
                        <span className="adm-badge gold" style={{ marginInlineStart: 8 }}>
                          Returning
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--adm-muted)' }} dir="ltr">{c.phone}</td>
                    <td style={{ color: 'var(--adm-muted)', maxWidth: 220 }}>
                      {c.last_address ?? '—'}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--adm-gold)' }}>{c.orders_count}</td>
                    <td style={{ fontWeight: 700 }}>{money(Number(c.total_spent))}</td>
                    <td style={{ color: 'var(--adm-muted)', fontSize: '0.78rem' }}>{c.joined_at}</td>
                    <td>
                      <div className="adm-actions-cell">
                        <button
                          type="button"
                          title="WhatsApp"
                          onClick={() =>
                            window.open(`https://wa.me/${toWaNumber(c.phone)}`, '_blank')
                          }
                          style={{
                            background: '#25D366',
                            color: '#000',
                            border: 'none',
                            borderRadius: 6,
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fa-brands fa-whatsapp" /> WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="adm-empty-table">
                      <i className="fa-solid fa-users" />
                      <p>No customers found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}