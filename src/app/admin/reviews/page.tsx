'use client'
import { getErrorMessage } from '@/lib/errors'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewApi } from '@/lib/api'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'

// ريم بتخزن الوقت UTC من غير Z
const formatDate = (s?: string) => {
  if (!s) return '—'
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s) ? s.replace(' ', 'T') + 'Z' : s
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ReviewsPage() {
  const queryClient = useQueryClient()

  const { data: reviewsRaw = [], isLoading, isError, error } = useQuery<any[]>({
    queryKey: ['admin-reviews'],
    queryFn: reviewApi.getAll,
    staleTime: 0,
  })
  const reviews = Array.isArray(reviewsRaw) ? reviewsRaw : []

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => reviewApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-reviews'] })
      toast.success('Review deleted successfully!')
    },
   onError: (err: unknown) => {
  toast.error('Failed to delete review', getErrorMessage(err, 'Failed to delete review'))
},
  })

  // متوسط التقييم (نفس حسبة الداشبورد)
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
      : '0.0'

  return (
    <>
      <TopBar title="Reviews" />
      <div className="adm-content">

        {isLoading && (
          <div className="adm-loading-state">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading reviews...</p>
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
                All Reviews ({reviews.length}){' '}
                <span style={{ color: 'var(--adm-gold)', fontSize: '0.8rem' }}>★ {avg}</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Order</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => {
                  const id = r.id
                  const name = r.customer?.name ?? r.customer_name ?? r.customerName ?? '—'
                  const phone = r.customer?.phone ?? r.customer_phone ?? r.customerPhone ?? ''
                  const orderId = r.order_id ?? r.order?.id
                  const rate = Math.min(5, Math.max(0, Math.round(Number(r.rating) || 0)))
                  const comment = r.comment ?? '—'

                  return (
                    <tr key={id}>
                      <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>#{id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{name}</div>
                        {phone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>{phone}</div>
                        )}
                      </td>
                      <td style={{ color: 'var(--adm-muted)' }}>
                        {orderId ? `#${orderId}` : '—'}
                      </td>
                      <td style={{ color: 'var(--adm-gold)', letterSpacing: '2px', fontSize: '1rem' }}>
                        {'★'.repeat(rate)}
                        {'☆'.repeat(5 - rate)}
                      </td>
                      <td
                        style={{
                          color: 'var(--adm-muted)',
                          maxWidth: '300px',
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={comment}
                      >
                        &ldquo;{comment}&rdquo;
                      </td>
                      <td style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>
                        {formatDate(r.created_at ?? r.createdAt)}
                      </td>
                      <td>
                        <button
                          className="adm-btn danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                          disabled={deleteMutation.isPending}
                          onClick={() =>
                            toast.confirm(
                              'Delete Review?',
                              'Are you sure you want to permanently remove this review?',
                              () => deleteMutation.mutate(id)
                            )
                          }
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {reviews.length === 0 && (
              <div className="adm-empty">
                <i className="fa-solid fa-star" />
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}