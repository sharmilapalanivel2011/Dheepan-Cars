import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./MyOrders.css"

const STATUS_META = {
  "Order Placed":     { label: "Order Placed",    color: "status--pending"    },
  "Processing":       { label: "Processing",       color: "status--processing" },
  "Shipped":          { label: "Shipped",          color: "status--shipped"    },
  "Out for Delivery": { label: "Out for Delivery", color: "status--shipped"    },
  "Delivered":        { label: "Delivered",        color: "status--delivered"  },
  "Cancelled":        { label: "Cancelled",        color: "status--cancelled"  },
}

const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [filter, setFilter]   = useState("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/my-orders/${user.email}`)
        setOrders(res.data || [])
      } catch (err) {
        setError("Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }
    if (user?.email) fetchOrders()
    else setLoading(false)
  }, [user])

  // ── Helper: is this a cart order? ──
  const isCartOrder = (order) => order.items && order.items.length > 0

  const FILTER_TABS = ["all", "Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"]

  const filtered = filter === "all"
    ? orders
    : orders.filter(o => o.trackingStatus === filter)

  const totalSpent = orders.reduce((sum, o) => {
    if (isCartOrder(o)) return sum + Number(o.totalAmount || 0)
    return sum + Number(o.product?.price || 0)
  }, 0)

  if (!user) {
    return (
      <div className="mo-wrap">
        <div className="mo-empty-state">
          <div className="mo-empty-icon">🔒</div>
          <h2>Login to see your orders</h2>
          <Link to="/" className="mo-btn mo-btn--primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mo-wrap">

      {/* Header */}
      <div className="mo-header">
        <div>
          <h1 className="mo-heading">My Orders</h1>
          <p className="mo-sub">
            {loading ? "Loading..." : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
          </p>
        </div>
        <Link to="/products" className="mo-btn mo-btn--outline">+ Shop More</Link>
      </div>

      {/* Summary Stats */}
      {!loading && (
        <div className="mo-summary-bar">
          <div className="mo-stat">
            <span className="mo-stat-num">{orders.length}</span>
            <div className="mo-stat-label">Total orders</div>
          </div>
          <div className="mo-stat">
            <span className="mo-stat-num mo-stat-num--green">
              {orders.filter(o => o.trackingStatus === "Delivered").length}
            </span>
            <div className="mo-stat-label">Delivered</div>
          </div>
          <div className="mo-stat">
            <span className="mo-stat-num mo-stat-num--red">
              ₹{totalSpent.toLocaleString("en-IN")}
            </span>
            <div className="mo-stat-label">Total spent</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mo-tabs">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            className={`mo-tab ${filter === tab ? "mo-tab--active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab === "all" ? "All" : tab}
            {tab !== "all" && (
              <span className="mo-tab-count">
                {orders.filter(o => o.trackingStatus === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div className="mo-error">{error}</div>}

      {/* Loading Skeleton */}
      {loading && (
        <div className="mo-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="mo-card mo-card--skeleton">
              <div className="mo-skeleton mo-skeleton--line" style={{ width: "40%" }} />
              <div className="mo-skeleton mo-skeleton--line" style={{ width: "25%" }} />
              <div className="mo-skeleton mo-skeleton--rect" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && !error && (
        <div className="mo-empty-state">
          <div className="mo-empty-icon">📦</div>
          <h2>{filter === "all" ? "No orders yet!" : `No "${filter}" orders`}</h2>
          <p>{filter === "all" ? "Start shopping for your first RC car." : "Try a different filter."}</p>
          {filter === "all" && (
            <Link to="/products" className="mo-btn mo-btn--primary">Browse Products</Link>
          )}
        </div>
      )}

      {/* Orders List */}
      {!loading && (
        <div className="mo-list">
          {filtered.map(order => {
            const trackStatus = order.trackingStatus || "Order Placed"
            const statusMeta  = STATUS_META[trackStatus] || STATUS_META["Order Placed"]
            const date        = new Date(order.date).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })
            const orderTotal = isCartOrder(order)
              ? Number(order.totalAmount || 0)
              : Number(order.product?.price || 0)

            return (
              <div key={order._id} className="mo-card mo-card--open">

                {/* Card Header */}
                <div className="mo-card-header">
                  <div className="mo-card-left">
                    <span className="mo-order-id">#{order.orderId || order._id?.slice(-8).toUpperCase()}</span>
                    <span className="mo-order-date">{date}</span>
                  </div>
                  <div className="mo-card-right">
                    <span className={`mo-status ${statusMeta.color}`}>{statusMeta.label}</span>
                    <span className="mo-order-total">₹{orderTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="mo-card-body">

                  {/* Product Items */}
                  <div className="mo-items">

                    {/* Single product (Buy Now flow) */}
                    {!isCartOrder(order) && order.product && (
                      <div className="mo-item">
                        <img
                          src={order.product.image || "/placeholder.png"}
                          alt={order.product.name}
                          className="mo-item-img"
                        />
                        <div className="mo-item-info">
                          <p className="mo-item-name">{order.product.name}</p>
                          <p className="mo-item-meta">
                            ₹{Number(order.product.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Multiple items (Cart flow) */}
                    {isCartOrder(order) && order.items.map((item, idx) => (
                      <div key={idx} className="mo-item">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="mo-item-img"
                        />
                        <div className="mo-item-info">
                          <p className="mo-item-name">{item.name}</p>
                          <p className="mo-item-meta">
                            Qty: {item.quantity} · ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="mo-item-subtotal">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}

                  </div>

                  {/* Address */}
                  {order.address && (
                    <div className="mo-address">
                      <span className="mo-address-label">Deliver to</span>
                      <p className="mo-address-text">
                        {order.name}, {order.address}, {order.city} – {order.pincode}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mo-card-actions">
                    <Link to={`/order-tracking/${order._id}`} className="mo-btn mo-btn--outline">
                      🚚 Track Order
                    </Link>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders