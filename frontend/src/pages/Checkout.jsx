import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { FaStar, FaTruck, FaShieldAlt, FaLock } from "react-icons/fa"
import { MdLocalOffer, MdVerified } from "react-icons/md"
import "./Checkout.css"


function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()


  // Support both single product (Buy Now) and multi-item cart (Proceed to Checkout)
  const product = location.state?.product       // Buy Now flow
  const items   = location.state?.items         // Cart flow
  const totalPrice = location.state?.totalPrice // Cart flow total


  const isSingleProduct = !!product
  const isCartFlow      = !!items && items.length > 0


  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [phone, setPhone]     = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity]       = useState("")
  const [pincode, setPincode] = useState("")
  const [payment, setPayment] = useState("Cash on Delivery")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})


  if (!isSingleProduct && !isCartFlow) {
    return (
      <div className="co-no-product">
        <h2>No product selected</h2>
        <button onClick={() => navigate("/products")}>Go to Products</button>
      </div>
    )
  }


  // Calculated totals
  const displayItems   = isSingleProduct ? [{ ...product, quantity: 1 }] : items
  const computedTotal  = isSingleProduct
    ? product.price
    : totalPrice


  const computedOriginal = displayItems.reduce((sum, item) => {
    const orig = item.originalPrice || Math.round(item.price * 1.3)
    return sum + orig * (item.quantity || 1)
  }, 0)
  const savings = computedOriginal - computedTotal


  const validateForm = () => {
    let newErrors = {}
    if (!name.trim())    newErrors.name    = "Full name is required"
    if (!email.trim())   newErrors.email   = "Email is required"
    if (!phone.trim())   newErrors.phone   = "Phone number is required"
    else if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = "Enter valid 10 digit number"
    if (!address.trim()) newErrors.address = "Address is required"
    if (!city.trim())    newErrors.city    = "City is required"
    if (!pincode.trim()) newErrors.pincode = "Pincode is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleOrder = async () => {
    if (loading) return
    if (!validateForm()) {
      alert("Please fill all required fields correctly")
      return
    }


    setLoading(true)
    const orderId = "DC" + Date.now()


    try {
      const res = await fetch("http://localhost:5000/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, address, city, pincode, payment,
          // Send both product (single) and items (cart) to backend
          product: isSingleProduct ? product : null,
          items:   isCartFlow ? items : null,
          totalAmount: computedTotal,
          orderId
        })
      })


      if (!res.ok) {
        alert("Order saving failed")
        setLoading(false)
        return
      }


      await fetch("http://localhost:5000/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, address, city, pincode,
          product: isSingleProduct ? product : null,
          items:   isCartFlow ? items : null,
          totalAmount: computedTotal,
          orderId
        })
      })


      alert("Order placed & confirmation email sent!")
      navigate("/order-success", {
        state: {
          product: isSingleProduct ? product : null,
          items:   isCartFlow ? items : null,
          totalAmount: computedTotal,
          name, address, city, pincode, orderId
        }
      })
    } catch (error) {
      console.log(error)
      alert("Server error. Please try again later.")
    }
    setLoading(false)
  }


  return (
    <div className="co-page">
      <div className="co-page-header">
        <h2 className="co-page-title">Checkout</h2>
        <p className="co-page-sub">Complete your order securely</p>
      </div>


      <div className="co-layout">


        {/* ---- LEFT: Form ---- */}
        <div className="co-form-col">
          <div className="co-section">
            <div className="co-section-label">
              <span className="co-step-num">01</span>
              <h3>Delivery Details</h3>
            </div>


            <div className="co-field-group">
              <div className={`co-field ${errors.name ? "co-field--error" : name ? "co-field--filled" : ""}`}>
                <input id="co-name" type="text" value={name}
                  onChange={(e) => setName(e.target.value)} placeholder=" " />
                <label htmlFor="co-name">Full Name</label>
                {errors.name && <span className="co-error-msg">{errors.name}</span>}
              </div>


              <div className="co-row-2">
                <div className={`co-field ${errors.email ? "co-field--error" : email ? "co-field--filled" : ""}`}>
                  <input id="co-email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder=" " />
                  <label htmlFor="co-email">Email Address</label>
                  {errors.email && <span className="co-error-msg">{errors.email}</span>}
                </div>


                <div className={`co-field ${errors.phone ? "co-field--error" : phone ? "co-field--filled" : ""}`}>
                  <input id="co-phone" type="text" value={phone}
                    onChange={(e) => setPhone(e.target.value)} placeholder=" " maxLength={10} />
                  <label htmlFor="co-phone">Phone Number</label>
                  {errors.phone && <span className="co-error-msg">{errors.phone}</span>}
                </div>
              </div>


              <div className={`co-field co-field--textarea ${errors.address ? "co-field--error" : address ? "co-field--filled" : ""}`}>
                <textarea id="co-address" value={address}
                  onChange={(e) => setAddress(e.target.value)} placeholder=" " rows={3} />
                <label htmlFor="co-address">Full Address</label>
                {errors.address && <span className="co-error-msg">{errors.address}</span>}
              </div>


              <div className="co-row-2">
                <div className={`co-field ${errors.city ? "co-field--error" : city ? "co-field--filled" : ""}`}>
                  <input id="co-city" type="text" value={city}
                    onChange={(e) => setCity(e.target.value)} placeholder=" " />
                  <label htmlFor="co-city">City</label>
                  {errors.city && <span className="co-error-msg">{errors.city}</span>}
                </div>


                <div className={`co-field ${errors.pincode ? "co-field--error" : pincode ? "co-field--filled" : ""}`}>
                  <input id="co-pincode" type="text" value={pincode}
                    onChange={(e) => setPincode(e.target.value)} placeholder=" " maxLength={6} />
                  <label htmlFor="co-pincode">Pincode</label>
                  {errors.pincode && <span className="co-error-msg">{errors.pincode}</span>}
                </div>
              </div>
            </div>
          </div>


          <div className="co-section">
            <div className="co-section-label">
              <span className="co-step-num">02</span>
              <h3>Payment Method</h3>
            </div>
            <div className="co-payment-option co-payment-option--selected">
              <span className="co-payment-icon">💵</span>
              <div>
                <p className="co-payment-name">Cash on Delivery</p>
                <p className="co-payment-sub">Pay when your order arrives</p>
              </div>
              <span className="co-payment-check">✓</span>
            </div>
          </div>


          <div className="co-trust-bar">
            <div className="co-trust-item"><FaShieldAlt /><span>Buyer Protection</span></div>
            <div className="co-trust-item"><FaTruck /><span>Free Delivery</span></div>
            <div className="co-trust-item"><FaLock /><span>Secure Checkout</span></div>
          </div>
        </div>


        {/* ---- RIGHT: Sticky Order Summary ---- */}
        <div className="co-summary-col">
          <div className="co-summary-card">
            <h3 className="co-summary-title">
              Order Summary ({displayItems.length} item{displayItems.length !== 1 ? "s" : ""})
            </h3>


            {/* Product list */}
            {displayItems.map((item) => {
              const id   = item.id || item._id
              const orig = item.originalPrice || Math.round(item.price * 1.3)
              const disc = Math.round(((orig - item.price) / orig) * 100)
              return (
                <div className="co-product-card" key={id}>
                  <div className="co-product-img-wrap">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="co-product-meta">
                    <p className="co-product-name">{item.name}</p>
                    {item.quantity > 1 && (
                      <p className="co-product-desc">Qty: {item.quantity}</p>
                    )}
                    <div className="co-price-row">
                      <span className="co-price">₹{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                      {orig > item.price && (
                        <>
                          <span className="co-original">₹{(orig * (item.quantity || 1)).toLocaleString()}</span>
                          <span className="co-discount">{disc}% off</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}


            {/* Price breakdown */}
            <div className="co-price-breakdown">
              <div className="co-breakdown-row">
                <span>Total MRP</span>
                <span>₹{computedOriginal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="co-breakdown-row co-saving">
                  <span>Discount</span>
                  <span>− ₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="co-breakdown-row">
                <span>Delivery</span>
                <span className="co-free">Free</span>
              </div>
              <hr className="co-breakdown-divider" />
              <div className="co-breakdown-total">
                <span>Total</span>
                <span>₹{computedTotal.toLocaleString()}</span>
              </div>
            </div>


            <button
              className={`co-place-btn ${loading ? "co-place-btn--loading" : ""}`}
              onClick={handleOrder}
              disabled={loading}
            >
              {loading ? (<><span className="co-spinner" />Placing Order...</>) : "Place Order"}
            </button>


            <p className="co-secure-note">🔒 100% secure &amp; encrypted</p>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Checkout
