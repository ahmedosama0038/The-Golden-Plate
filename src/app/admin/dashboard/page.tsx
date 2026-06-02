
// ============================================================
//  admin/dashboard/page.tsx — الداشبورد الرئيسي
//  Server Component
// ============================================================

import TopBar from '@/components/admin/TopBar'
import { menuItems, defaultReviews } from '@/data/restaurant'

// بيانات وهمية للـ UI — هتيجي من الـ API لاحقاً
const MOCK_ORDERS = [
  { id: '#1042', customer: 'James M.',  items: 'Wagyu + Scallops', total: '$113', status: 'confirmed',  time: '8 min ago'  },
  { id: '#1041', customer: 'Sophia L.', items: 'Sea Bass + Wine',   total: '$70',  status: 'preparing', time: '15 min ago' },
  { id: '#1040', customer: 'Yuki N.',   items: 'Truffle Arancini',  total: '$18',  status: 'ready',     time: '22 min ago' },
  { id: '#1039', customer: 'Marcus T.', items: 'Chocolate Sphere',  total: '$19',  status: 'delivered', time: '1 hr ago'   },
]

// badge color حسب الـ status
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   'yellow',
    confirmed: 'blue',
    preparing: 'yellow',
    ready:     'green',
    delivered: 'gold',
    cancelled: 'red',
  }
  return <span className={`adm-badge ${map[status] ?? 'gold'}`}>{status}</span>
}

export default function DashboardPage() {
  const pendingReviews = defaultReviews.filter((r) => r.status === 'pending').length

  const STATS = [
    { label: 'Total Orders Today', value: '24',              icon: 'fa-solid fa-bag-shopping',  color: '#3b82f6' },
    { label: 'Revenue Today',      value: '$1,840',          icon: 'fa-solid fa-dollar-sign',   color: '#22c55e' },
    { label: 'Reservations',       value: '8',               icon: 'fa-solid fa-calendar-days', color: '#D4AF37' },
    { label: 'Pending Reviews',    value: String(pendingReviews), icon: 'fa-solid fa-star',     color: '#f59e0b' },
    { label: 'Menu Items',         value: String(menuItems.length), icon: 'fa-solid fa-utensils', color: '#a855f7' },
  ]

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="adm-content">

        {/* Stats */}
        <div className="adm-stats">
          {STATS.map(({ label, value, icon, color }) => (
            <div key={label} className="adm-stat-card">
              <div className="adm-stat-icon" style={{ background: `${color}18`, color }}>
                <i className={icon} />
              </div>
              <div>
                <div className="adm-stat-val">{value}</div>
                <div className="adm-stat-lbl">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="adm-table-wrap">
          <div className="adm-table-header">
            <div className="adm-table-title">Recent Orders</div>
            <a href="/admin/orders" className="adm-btn ghost" style={{ fontSize: '0.75rem' }}>
              View All <i className="fa-solid fa-arrow-right" />
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id}>
                  <td style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>{order.id}</td>
                  <td>{order.customer}</td>
                  <td style={{ color: 'var(--adm-muted)' }}>{order.items}</td>
                  <td style={{ fontWeight: 600 }}>{order.total}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td style={{ color: 'var(--adm-muted)' }}>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}