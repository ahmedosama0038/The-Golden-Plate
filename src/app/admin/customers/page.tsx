'use client'

import { useState }         from 'react'
import { useQuery }         from '@tanstack/react-query'
import { customerApi }      from '@/lib/api'
import TopBar               from '@/components/admin/TopBar'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [phoneSearch, setPhoneSearch] = useState('')

  // ── جيب كل الـ customers ──
  const { data: customers = [], isLoading } = useQuery<any[]>({
    queryKey: ['customers'],
    queryFn:  customerApi.getAll,
  })

  // ── Search by phone ──
  const { data: phoneResult, isFetching: phoneLoading } = useQuery<any>({
    queryKey: ['customer-phone', phoneSearch],
    queryFn:  () => customerApi.searchByPhone(phoneSearch),
    enabled:  phoneSearch.length >= 10, // ابدأ البحث لما يكتب 10 أرقام
  })

  // ── فلتر بالاسم ──
  const filtered = customers.filter((c) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <TopBar title="Customers" />
      <div className="adm-content">

        {/* Search Row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>

          {/* Search by name */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)', fontSize: '0.8rem' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.6rem 0.9rem 0.6rem 2.2rem', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', width: '100%' }}
            />
          </div>

          {/* Search by phone */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <i className="fa-solid fa-phone" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)', fontSize: '0.8rem' }} />
            <input
              type="tel"
              placeholder="Search by phone (01XXXXXXXXX)..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              style={{ background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.6rem 0.9rem 0.6rem 2.2rem', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        {/* Phone Search Result */}
        {phoneSearch.length >= 10 && (
          <div className="adm-table-wrap" style={{ marginBottom: '1.2rem' }}>
            <div className="adm-table-header">
              <div className="adm-table-title">
                <i className="fa-solid fa-phone" style={{ marginRight: '0.5rem', color: 'var(--adm-gold)' }} />
                Phone Search Result
              </div>
            </div>
            {phoneLoading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--adm-muted)' }}>
                <i className="fa-solid fa-spinner fa-spin" />
              </div>
            ) : phoneResult ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>City</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{phoneResult.id}</td>
                    <td style={{ fontWeight: 600 }}>{phoneResult.name || '—'}</td>
                    <td>{phoneResult.phoneNumber || phoneResult.phone || '—'}</td>
                    <td style={{ color: 'var(--adm-muted)' }}>{phoneResult.email || '—'}</td>
                    <td style={{ color: 'var(--adm-muted)' }}>{phoneResult.city || '—'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="adm-empty">
                <i className="fa-solid fa-user-slash" />
                <p>No customer found with this phone number.</p>
              </div>
            )}
          </div>
        )}

        {/* Customers Table */}
        <div className="adm-table-wrap">
          <div className="adm-table-header">
            <div className="adm-table-title">
              All Customers ({filtered.length})
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty">
              <i className="fa-solid fa-users" />
              <p>No customers found.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const id    = customer.id    || customer.Id
                  const name  = customer.name  || customer.Name  || '—'
                  const phone = customer.phoneNumber || customer.phone || '—'
                  const email = customer.email || '—'
                  const city  = customer.city  || customer.City  || '—'

                  return (
                    <tr key={id}>
                      <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{id}</td>
                      <td style={{ fontWeight: 600 }}>{name}</td>
                      <td>{phone}</td>
                      <td style={{ color: 'var(--adm-muted)' }}>{email}</td>
                      <td style={{ color: 'var(--adm-muted)' }}>{city}</td>
                      <td>
                        {/* Statistics Button */}
                        <button
                          className="adm-btn ghost"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                          onClick={() => alert(`Customer #${id} Statistics\nComing soon!`)}
                        >
                          <i className="fa-solid fa-chart-bar" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  )
}