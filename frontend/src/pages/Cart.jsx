// src/pages/Cart.jsx
import { API_URL } from "../config"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { FaBolt, FaShoppingBag, FaLock, FaTruck, FaShieldAlt } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import "./Cart.css"

function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem } = useContext(CartContext)
  const navigate = useNavigate()

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  )
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalOriginal = cart.reduce((total, item) => {
    const orig = item.originalPrice || Math.round(item.price * 1.3)
    return total + orig * item.quantity
  }, 0)
  const savings = totalOriginal - totalPrice

  // Buy Now — send single item straight to Checkout
  const handleBuyNow = (item) => {
    navigate("/checkout", { state: { product: item } })
  }

  const handleProceedCheckout = () => {
  navigate("/checkout", { state: { items: cart, totalPrice } })
}

  return (
    <div className="cart-page">

      {/* ── Header ── */}
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
        {cart.length > 0 && (
          <span className="cart-count-badge">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Empty State ── */}
      {cart.length === 0 ? (
        <div className="empty-cart-wrapper">
          <span className="empty-cart-icon">
            <FaShoppingBag />
          </span>
          <h3>Your Cart is Empty</h3>
          <p>Looks like you haven't added any items yet.</p>
          <button className="empty-shop-btn" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="cart-container">

          {/* ── Cart Items ── */}
          <div className="cart-items">
            {cart.map((item) => {
              const id = item.id || item._id
              const itemSubtotal = item.price * item.quantity
              const itemOriginal = item.originalPrice || Math.round(item.price * 1.3)
              const discountPct = Math.round(((itemOriginal - item.price) / itemOriginal) * 100)

              return (
                <div className="cart-item" key={id}>

                  {/* Image */}
                  <div className="cart-item-img-wrap">
                    <img src={item.image} alt={item.name} />
                    {discountPct > 0 && (
                      <span className="cart-item-discount-tag">{discountPct}% OFF</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p className="cart-desc">{item.desc}</p>

                    <div className="cart-price-row">
                      <span className="cart-price">₹{item.price.toLocaleString()}</span>
                      {itemOriginal > item.price && (
                        <span className="cart-original">
                          ₹{itemOriginal.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {item.quantity > 1 && (
                      <p className="cart-item-subtotal">
                        Subtotal: ₹{itemSubtotal.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="cart-controls">

                    {/* Quantity */}
                    <div className="quantity">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQty(id)}
                        aria-label="Decrease quantity"
                      >
                        &#8722;
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQty(id)}
                        aria-label="Increase quantity"
                      >
                        &#43;
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="cart-item-actions">
                      <button
                        className="buy-now-btn"
                        onClick={() => handleBuyNow(item)}
                      >
                        <FaBolt className="btn-icon" />
                        Buy Now
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(id)}
                        aria-label="Remove item"
                      >
                        <MdDeleteOutline className="btn-icon" />
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Sticky Summary ── */}
          <div className="cart-summary">
            <h3 className="summary-heading">Order Summary</h3>

            <div className="summary-row">
              <span>Price ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
              <span>₹{totalOriginal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="summary-green">&#8722; ₹{savings.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="summary-green">Free</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span className="summary-total-label">Total Amount</span>
              <span className="summary-total-amount">₹{totalPrice.toLocaleString()}</span>
            </div>

            {savings > 0 && (
              <div className="summary-savings">
                &#127881; You save ₹{savings.toLocaleString()} on this order!
              </div>
            )}

            <button className="checkout-btn" onClick={handleProceedCheckout}>
              Proceed to Checkout
            </button>

            <div className="summary-trust-bar">
              <span><FaLock /> Secure</span>
              <span><FaTruck /> Free Delivery</span>
              <span><FaShieldAlt /> Buyer Protection</span>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default Cart