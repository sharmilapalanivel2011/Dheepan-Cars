import { API_URL } from "../config"

import { useLocation, useNavigate } from "react-router-dom"
import { FaCheckCircle, FaTruck, FaLock, FaShoppingCart } from "react-icons/fa"
import { MdLocalOffer } from "react-icons/md"
import "./OrderSuccess.css"

function OrderSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state

  if (!data) {
    return (
      <div className="os-no-order">
        <h2>No Order Found</h2>
        <button onClick={() => navigate("/products")}>Go to Products</button>
      </div>
    )
  }

  const { product, items, totalAmount, orderId, name, address, city, pincode } = data

  // Support both single and multi-item
  const displayItems = items ? items : (product ? [{ ...product, quantity: 1 }] : [])
  const total = totalAmount || product?.price || 0

  const steps = ["Confirmed", "Processing", "Shipped", "Delivered"]

  return (
    <div className="os-page">
      <div className="os-card">

        {/* Hero */}
        <div className="os-hero">
          <div className="os-check-ring">
            <FaCheckCircle className="os-check-icon" />
          </div>
          <h1 className="os-title">Order Confirmed!</h1>
          <p className="os-subtitle">Thank you for your purchase. We'll get it to you soon.</p>
          <div className="os-orderid">Order ID: {orderId}</div>
        </div>

        <div className="os-body">

          {/* Product(s) */}
          {displayItems.map((item, idx) => (
            <div className="os-product-row" key={idx}>
              <img
                src={item?.image}
                alt={item?.name}
                className="os-product-img"
                onError={e => { e.target.style.display = "none" }}
              />
              <div className="os-product-details">
                {item?.badge && (
                  <div className="os-badge-row">
                    <span className="os-badge">{item.badge}</span>
                  </div>
                )}
                <p className="os-product-name">{item?.name}</p>
                {item?.quantity > 1 && (
                  <p className="os-product-desc">Qty: {item.quantity}</p>
                )}
                <p className="os-product-price">
                  ₹{(item?.price * (item?.quantity || 1)).toLocaleString()}
                </p>
                <div className="os-offer-tag">
                  <MdLocalOffer /> Free delivery on this item
                </div>
              </div>
            </div>
          ))}

          {/* Total if multi-item */}
          {displayItems.length > 1 && (
            <div style={{
              textAlign: "right", padding: "10px 20px",
              fontWeight: "700", fontSize: "18px", color: "#e50914"
            }}>
              Total: ₹{total.toLocaleString()}
            </div>
          )}

          {/* Info Grid */}
          <div className="os-info-grid">
            <div className="os-info-card">
              <p className="os-info-label">Delivery Address</p>
              {name && <p className="os-info-name">{name}</p>}
              <p>{address}</p>
              <p>{city} — {pincode}</p>
              <div className="os-delivery-estimate">
                <FaTruck className="os-truck-icon" />
                <span>Estimated: <strong>4–6 Business Days</strong></span>
              </div>
            </div>

            <div className="os-info-card">
              <p className="os-info-label">Payment Method</p>
              <p className="os-payment-name">💵 Cash on Delivery</p>
              <p className="os-payment-sub">Pay when the package arrives.</p>
            </div>
          </div>

          {/* Order Tracker */}
          <div className="os-tracker-section">
            <p className="os-tracker-title">Order Status</p>
            <div className="os-steps">
              {steps.map((step, i) => (
                <div className="os-step-item" key={step}>
                  <div className={`os-step-dot ${i === 0 ? "os-step-done" : "os-step-pending"}`}>
                    {i === 0 ? "✓" : i + 1}
                  </div>
                  <div className="os-step-label">{step}</div>
                  {i < steps.length - 1 && (
                    <div className={`os-step-line ${i === 0 ? "os-line-done" : ""}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="os-actions">
            <button className="os-btn-primary" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
            <button className="os-btn-secondary" onClick={() => navigate("/cart")}>
              <FaShoppingCart /> View Cart
            </button>
          </div>

          <div className="os-footer-note">
            <FaLock style={{ fontSize: "12px", marginRight: "5px" }} />
            Order confirmation email sent &nbsp;·&nbsp; 100% Secure &amp; Encrypted
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess