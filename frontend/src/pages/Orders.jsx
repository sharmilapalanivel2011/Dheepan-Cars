import { useEffect, useState } from "react"
import AdminSidebar from "../components/AdminSidebar"
import "./Orders.css"
import { useNavigate } from "react-router-dom"

function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
  }, [])

  const filteredOrders = orders.filter(order =>
    order.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.orderId?.toLowerCase().includes(search.toLowerCase())
  )

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm("Delete this order?")
    if (!confirmDelete) return
    await fetch(`http://localhost:5000/order/${id}`, { method: "DELETE" })
    setOrders(orders.filter(o => o._id !== id))
  }

  // ── Helper: is this a cart order? ──
  const isCartOrder = (order) => order.items && order.items.length > 0

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Orders</h1>

        <input
          type="text"
          placeholder="Search by name or Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />

        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div className="order-card" key={order._id}>

              {/* ── Single product (Buy Now flow) ── */}
              {!isCartOrder(order) && order.product && (
                <>
                  <img
                    src={order.product.image || "/placeholder.png"}
                    alt={order.product.name}
                  />
                  <h3>{order.product.name}</h3>
                  <p>₹{Number(order.product.price || 0).toLocaleString()}</p>
                  <p style={{ fontWeight: "700", color: "#e50914" }}>
                    Total: ₹{Number(order.totalAmount || order.product.price || 0).toLocaleString()}
                  </p>
                </>
              )}

              {/* ── Multiple items (Cart flow) ── */}
              {isCartOrder(order) && (
                <>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                    {order.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px"
                        }}
                      />
                    ))}
                  </div>
                  <h3>{order.items.map(i => i.name).join(", ")}</h3>
                  <p>{order.items.map(i => `${i.name} ×${i.quantity}`).join(" | ")}</p>
                  <p style={{ fontWeight: "700", color: "#e50914" }}>
                    Total: ₹{Number(order.totalAmount || 0).toLocaleString()}
                  </p>
                </>
              )}

              {/* ── Common Fields ── */}
              <p><b>ID:</b> {order.orderId}</p>
              <p>{order.name}</p>

              {/* ── Status Dropdown ── */}
              <select
                className="status-dropdown"
                defaultValue={order.trackingStatus || "Order Placed"}
                onChange={async (e) => {
                  const newStatus = e.target.value
                  await fetch(`http://localhost:5000/order-tracking/${order._id}/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus, note: "" })
                  })
                  setOrders(orders.map(o =>
                    o._id === order._id ? { ...o, trackingStatus: newStatus } : o
                  ))
                }}
              >
                <option value="Order Placed">📋 Order Placed</option>
                <option value="Processing">⚙️ Processing</option>
                <option value="Shipped">🚚 Shipped</option>
                <option value="Out for Delivery">📦 Out for Delivery</option>
                <option value="Delivered">✅ Delivered</option>
                <option value="Cancelled">❌ Cancelled</option>
              </select>

              {/* ── Track Button ── */}
              <button
                className="track-btn"
                onClick={() => navigate(`/admin/order-tracking/${order._id}`)}
                style={{
                  backgroundColor: "#ff0000",
                  color: "#fff",
                  border: "none",
                  padding: "8px 10px",
                  fontSize: "14px",
                  marginTop: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "0.3s ease"
                }}
              >
                🔍 Track Order
              </button>

              {/* ── Delete Button ── */}
              <button
                className="delete-btn"
                onClick={() => deleteOrder(order._id)}
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders