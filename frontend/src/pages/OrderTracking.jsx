import { API_URL } from "../config"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import TrackingTimeline from "../components/TrackingTimeline"
import "./OrderTracking.css"
import { useAuth } from "../context/AuthContext"

function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const { admin } = useAuth()

  useEffect(() => {
    fetch(`${API_URL}/order-tracking/${orderId}`)
      .then(res => res.json())
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [orderId])

  if (loading) return <div className="track-center"><p>Loading...</p></div>
  if (!order)  return <div className="track-center"><p>Order not found.</p></div>

  // ── Determine if this is a cart order or single Buy Now order ──
  const isCartOrder = order.items && order.items.length > 0

  // ── Total amount ──
  const orderTotal = isCartOrder
    ? Number(order.totalAmount || 0)
    : Number(order.product?.price || 0)

  return (
    <div className="track-page">
      <div className="track-container">

        <button className="back-btn" onClick={() => navigate(admin ? "/admin/orders" : "/my-orders")}>
          ← Back
        </button>

        <h2>Track Order</h2>
        <p className="order-id-txt">Order ID: <b>{order.orderId}</b></p>

        <div className={`status-badge s-${order.trackingStatus?.toLowerCase().replace(/\s+/g, "-")}`}>
          {order.trackingStatus}
        </div>

        <TrackingTimeline
          currentStatus={order.trackingStatus}
          statusHistory={order.statusHistory}
        />

        {/* ── Product Section ── */}
        <div className="track-product-section">

          {/* Single product — Buy Now flow */}
          {!isCartOrder && order.product && (
            <div className="track-product">
              <img
                src={order.product.image || "/placeholder.png"}
                alt={order.product.name}
              />
              <div>
                <p className="prod-name">{order.product.name}</p>
                <p className="prod-price">₹{Number(order.product.price || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>
          )}

          {/* Multiple items — Cart flow */}
          {isCartOrder && (
            <div className="track-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="track-product">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                  />
                  <div>
                    <p className="prod-name">{item.name}</p>
                    <p className="prod-price">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      {item.quantity > 1 && (
                        <span className="prod-qty"> × {item.quantity}</span>
                      )}
                    </p>
                    {item.quantity > 1 && (
                      <p className="prod-subtotal">
                        Subtotal: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Cart order total */}
              <div className="track-order-total">
                <span>Order Total</span>
                <span>₹{orderTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

        </div>

        {/* ── Customer Info ── */}
        <div className="customer-info">
          <p><b>Name:</b> {order.name}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Address:</b> {order.address}, {order.city} - {order.pincode}</p>
        </div>

      </div>
    </div>
  )
}

export default OrderTracking