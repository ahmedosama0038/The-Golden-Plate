'use client'

import TopBar from '@/components/admin/TopBar'

// داتا الإحصائيات مطابقة تماماً للصورة المرجعية
const STATS = [
  { label: 'Total Revenue', value: '$12,450', change: '+12.5% vs last week', icon: 'fa-solid fa-dollar-sign', trend: 'up' },
  { label: 'Total Orders', value: '348', change: '+8.2% vs last week', icon: 'fa-solid fa-cart-shopping', trend: 'up' },
  { label: 'Dishes Served', value: '1,240', change: '+5.4% vs last week', icon: 'fa-solid fa-utensils', trend: 'up' },
  { label: 'Customer Rating', value: '4.9', change: '-0.1% vs last week', icon: 'fa-solid fa-star', trend: 'down' },
]

// داتا المبيعات الأسبوعية لرسم الشارت بالـ CSS الفخم
const WEEKLY_SALES = [
  { day: 'Mon', amount: '$4,500', height: '45%' },
  { day: 'Tue', amount: '$7,000', height: '70%' },
  { day: 'Wed', amount: '$5,500', height: '55%' },
  { day: 'Thu', amount: '$9,000', height: '90%' },
  { day: 'Fri', amount: '$8,500', height: '85%' },
  { day: 'Sat', amount: '$10,000', height: '100%' },
  { day: 'Sun', amount: '$6,000', height: '60%' },
]

// داتا الطلبات الأخيرة مطابقة للصورة بالظبط
const RECENT_ORDERS = [
  { id: '#ORD-4121', customer: 'Alice Smith', items: 'Wagyu Burger, Fries', total: '$42.00', status: 'Completed' },
  { id: '#ORD-4122', customer: 'Robert Fox', items: 'Truffle Risotto', total: '$28.00', status: 'Pending' },
  { id: '#ORD-4123', customer: 'Sarah Lee', items: 'Salmon, Red Wine', total: '$65.50', status: 'Completed' },
  { id: '#ORD-4124', customer: 'John Doe', items: 'Velvet Tart', total: '$14.00', status: 'Cancelled' },
  { id: '#ORD-4125', customer: 'Emily White', items: 'Lobster Thermidor', total: '$112.00', status: 'Pending' },
]

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard Overview" subtitle="Saturday, June 13, 2026" />
      
      <div className="adm-content">

        {/* 📊 1. Grid الكاردات الإحصائية العلوية */}
        <div className="adm-stats-grid-v2">
          {STATS.map((stat, idx) => (
            <div key={idx} className="adm-stat-card-v2">
              <div className="stat-card-header">
                <div className="stat-icon-box">
                  <i className={stat.icon} />
                </div>
              </div>
              <div className="stat-card-body">
                <p className="stat-value-v2">{stat.value}</p>
                <h3 className="stat-label-v2">{stat.label}</h3>
                <span className={`stat-change-v2 ${stat.trend}`}>
                  <i className={`fa-solid ${stat.trend === 'up' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 📈 2. شارت المبيعات الأسبوعية الفخم المصمم بالـ CSS */}
        <div className="adm-chart-section">
          <div className="chart-header-row">
            <h2>Weekly Sales Overview</h2>
            <div className="chart-dropdown-wrap">
              <select className="adm-chart-select">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>
          
          <div className="adm-bar-chart-container">
            <div className="bars-wrapper">
              {WEEKLY_SALES.map((sale, idx) => (
                <div key={idx} className="bar-column">
                  <div className="bar-tooltip">{sale.amount}</div>
                  <div className="bar-actual-fill" style={{ height: sale.height }}></div>
                  <span className="bar-day-label">{sale.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📑 3. جدول الطلبات الأخيرة الرايق */}
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
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order, idx) => (
                  <tr key={idx} className="adm-table-row-v2">
                    <td className="order-id-cell">{order.id}</td>
                    <td className="customer-cell">{order.customer}</td>
                    <td className="items-cell">{order.items}</td>
                    <td className="total-cell">{order.total}</td>
                    <td>
                      <span className={`adm-status-v2 ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}