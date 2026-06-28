'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationApi } from '@/lib/api'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'

const STATUS_MAP: Record<string | number, { label: string; color: string }> = {
  0: { label: 'pending',   color: 'yellow' },
  1: { label: 'confirmed', color: 'green'  },
  2: { label: 'cancelled', color: 'red'    },
  'pending':   { label: 'pending',   color: 'yellow' },
  'confirmed': { label: 'confirmed', color: 'green'  },
  'cancelled': { label: 'cancelled', color: 'red'    },
}

export default function ReservationsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all')

  // ── جلب الحجوزات ──
  const { data: reservations = [], isLoading } = useQuery<any[]>({
    queryKey: ['admin-reservations'],
    queryFn: reservationApi.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  // ── Mutation تحديث الحالة ──
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string | number; status: number }) => {
      return reservationApi.updateStatus(id, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] })
      toast.success(`Reservation status updated successfully!`)
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || err.message
      toast.error('Failed to update status', errMsg)
    }
  })

  // ── الفلترة ──
  const filtered = reservations.filter((r) => {
    const statusKey = r.status !== undefined && r.status !== null ? String(r.status).toLowerCase() : '0'
    const mapped = STATUS_MAP[statusKey] || { label: 'pending', color: 'yellow' }
    return filter === 'all' || mapped.label === filter
  })

  return (
    <>
      <TopBar title="Reservations" />
      <div className="adm-content">

        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem' }}>
          {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
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
              {s}
            </button>
          ))}
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
          </div>
        )}

        {!isLoading && (
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              <div className="adm-table-title">Reservations ({filtered.length})</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const statusValue = r.status !== undefined && r.status !== null ? String(r.status).toLowerCase() : '0'
                  const currentStatus = STATUS_MAP[statusValue] || { label: 'pending', color: 'yellow' }

                  const id         = r.id || r.Id
                  const notes      = r.notes || '—'
                  const date       = r.dateOnly || r.date
                  const time       = r.timeOnly || r.time
                  const guests     = r.numberOfGuests || r.guests || 0
                  const customerId = r.customerId || 0

                  // ← دلوقتي البيانات جاية مباشرة من الـ Reservation نفسها
                  const name  = r.customerName  || `Client #${customerId}`
                  const phone = r.customerPhone || '—'

                  return (
                    <tr key={id}>
                      <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>{phone}</div>
                      </td>
                      <td>{date || '—'}</td>
                      <td style={{ letterSpacing: '0.5px' }}>{time || '—'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--adm-gold)' }}>{guests}</td>
                      <td style={{ color: 'var(--adm-muted)', fontSize: '0.75rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={notes}>
                        {notes}
                      </td>
                      <td>
                        <span className={`adm-badge ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="adm-btn ghost"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: '#22c55e', borderColor: '#22c55e' }}
                            disabled={statusMutation.isPending}
                            onClick={() => statusMutation.mutate({ id: id, status: 1 })}
                          >
                            {statusMutation.isPending ? '...' : <i className="fa-solid fa-check" />}
                          </button>

                          <button
                            className="adm-btn danger"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                            disabled={statusMutation.isPending}
                            onClick={() => {
                              toast.confirm('Cancel Reservation?', 'Are you sure?', () => {
                                statusMutation.mutate({ id: id, status: 2 })
                              })
                            }}
                          >
                            {statusMutation.isPending ? '...' : <i className="fa-solid fa-xmark" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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