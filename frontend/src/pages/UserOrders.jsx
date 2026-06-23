import { API_URL } from "../config"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./UserOrders.css"

function UserOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) return
    fetch(`${API_URL}/my-orders/${user.email}`)
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return <div className="orders-center"><p>Loading your orders...</p></div>

  return (
    <div className="orders-page">
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-left">
                <img src={order.product?.image} alt="" width={70} />
                <div>
                  <p className="order-product-name">{order.product?.name}</p>
                  <p>₹{order.product?.price}</p>
                  <p style={{ fontSize: "12px", color: "#888" }}>
                    Order ID: {order.orderId}
                  </p>
                </div>
              </div>

              <div className="order-card-right">
                <span className={`status-badge s-${order.trackingStatus?.toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.trackingStatus || "Pending"}
                </span>
                <button
                  className="track-btn"
                  onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrders