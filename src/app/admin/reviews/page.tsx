'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewApi } from '@/lib/api'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'

export default function ReviewsPage() {
  const queryClient = useQueryClient()

  // ── 1️⃣ جلب التقييمات الحقيقية لايف م الباكيند ──
  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: ['admin-reviews'],
    queryFn: reviewApi.getAll,
    staleTime: 0,
  })

  // ── 2️⃣ ميوتايشن الحذف (DELETE) النهائي ──
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return reviewApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Review deleted successfully!')
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || err.message
      toast.error('Failed to delete review', errMsg)
    },
  })

  return (
    <>
      <TopBar title="Reviews" />
      <div className="adm-content">

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
          </div>
        )}

        {/* Table View */}
        {!isLoading && (
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              <div className="adm-table-title">All Reviews ({reviews.length})</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer ID</th>
                  <th>Rating</th>
                  <th>Review Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => {
                  const id = r.id || r.Id || r.ID
                  const customerId = r.customerId || r.CustomerId || '—'
                  const customerName = r.customerName || r.CustomerName || `Client #${customerId}`

                  const rawRate = r.rating || r.Rating || r.rate || r.Rate || 0
                  const parsedRate = Math.min(5, Math.max(0, Number(rawRate)))

                  const comment = r.comment || r.Comment || r.text || '—'
                  const createdDate = r.createdAt || r.CreatedAt || r.created || r.Created

                  return (
                    <tr key={id}>
                      <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{id}</td>
                      <td style={{ fontWeight: 600 }}>{customerName}</td>

                      <td style={{ color: 'var(--adm-gold)', letterSpacing: '2px', fontSize: '1rem' }}>
                        {'★'.repeat(parsedRate)}
                        {'☆'.repeat(5 - parsedRate)}
                      </td>

                      <td style={{ color: 'var(--adm-muted)', maxWidth: '300px', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comment}>
                        "{comment}"
                      </td>
                      <td style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>
                        {createdDate ? new Date(createdDate).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="adm-btn danger"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              toast.confirm('Delete Review?', 'Are you sure you want to permanently remove this review?', () => {
                                deleteMutation.mutate(id)
                              })
                            }}
                          >
                            {deleteMutation.isPending ? '...' : <i className="fa-solid fa-trash-can" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {reviews.length === 0 && (
              <div className="adm-empty">
                <i className="fa-solid fa-star" />
                <p>No reviews found on the server.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}