import { API_URL } from "../config"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"
import { useAuth } from "../context/AuthContext"
import "./AdminDashboard.css"



function AdminDashboard() {
  // 1️⃣ All useState first
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
 


  const { adminLogout } = useAuth()
  const navigate = useNavigate()


 useEffect(() => {
  fetch(`${API_URL}/orders`)
    .then(res => res.json())
    .then(data => setOrders(data))

  fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => setProducts(data))
}, [])


  // 3️⃣ Helper functions
  const getProductName = (order) => {
    if (order.items && order.items.length > 0)
      return order.items.map(i => i.name).join(", ")
    return order.product?.name || "—"
  }


  const getProductPrice = (order) => {
    if (order.items && order.items.length > 0)
      return Number(order.totalAmount || 0)
    return Number(order.product?.price || 0)
  }


  


  


  // 6️⃣ Stats (existing ones)
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + getProductPrice(o), 0)
  const totalProducts = products.length
  const pendingOrders = orders.filter(o =>
    o.trackingStatus === "Order Placed" || o.trackingStatus === "Processing"
  ).length


 


  // ── Recent Orders (last 5) ──
  const recentOrders = orders.slice(0, 5)


  // ── Activity Feed ──
  const activityFeed = orders.slice(0, 6).map(o => ({
    id: o._id,
    text: `New order by ${o.name} — ₹${getProductPrice(o).toLocaleString()}`,
    status: o.trackingStatus || "Order Placed",
    orderId: o.orderId
  }))


  const statusColor = (status) => {
    const map = {
      "Order Placed": "#f39c12",
      "Processing": "#3498db",
      "Shipped": "#9b59b6",
      "Out for Delivery": "#1abc9c",
      "Delivered": "#2ecc71",
      "Cancelled": "#e50914"
    }
    return map[status] || "#888"
  }


  const handleLogout = () => {
    adminLogout()
    navigate("/admin-login")
  }


  return (
    <div className="admin-layout">
      <AdminSidebar />


      <div className="admin-content">


        {/* ── Header ── */}
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p className="dash-subtitle">Welcome back, Admin 👋</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>


        {/* ── Stats Cards ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <p className="stat-label">Total Orders</p>
              <h2 className="stat-value">{totalOrders}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon red">💰</div>
            <div>
              <p className="stat-label">Total Revenue</p>
              <h2 className="stat-value">₹{totalRevenue.toLocaleString()}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div>
              <p className="stat-label">Total Products</p>
              <h2 className="stat-value">{totalProducts}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon red">⏳</div>
            <div>
              <p className="stat-label">Pending Orders</p>
              <h2 className="stat-value red">{pendingOrders}</h2>
            </div>
          </div>
        </div>


        {/* ── Main Grid ── */}
        <div className="dash-main-grid">


          {/* ── Recent Orders Table ── */}
          <div className="dash-section">
            <div className="section-header">
              <h3>🕐 Recent Orders</h3>
              <button className="view-all-btn" onClick={() => navigate("/admin/orders")}>
                View All →
              </button>
            </div>


            <div className="recent-table-wrapper">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">No orders yet</td>
                    </tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>{order.name}</td>
                        <td>{getProductName(order)}</td>
                        <td>₹{getProductPrice(order).toLocaleString()}</td>
                        <td>
                          <span
                            className="status-pill"
                            style={{ background: statusColor(order.trackingStatus) }}
                          >
                            {order.trackingStatus || "Order Placed"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="track-sm-btn"
                            onClick={() => navigate(`/admin/order-tracking/${order._id}`)}
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>


          {/* ── Right Column ── */}
          <div className="dash-right-col">


            {/* ── Quick Actions ── */}
            <div className="dash-section">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions">
                <button onClick={() => navigate("/admin/orders")}>
                  📦 View Orders
                </button>
                <button onClick={() => navigate("/admin/products")}>
                  🚗 Manage Products
                </button>
                
              </div>
            </div>


            {/* ── Activity Feed ── */}
            <div className="dash-section">
              <h3>🔔 Recent Activity</h3>
              <div className="activity-feed">
                {activityFeed.length === 0 ? (
                  <p className="no-data">No activity yet</p>
                ) : (
                  activityFeed.map((item) => (
                    <div key={item.id} className="activity-item">
                      <div
                        className="activity-dot"
                        style={{ background: statusColor(item.status) }}
                      />
                      <div>
                        <p className="activity-text">{item.text}</p>
                        <p className="activity-status">{item.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>


          </div>
        </div>




        


      </div>
    </div>
  )
}


export default AdminDashboard
