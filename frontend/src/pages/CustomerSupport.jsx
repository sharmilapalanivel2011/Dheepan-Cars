import { API_URL } from "../config"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import {
  FaArrowLeft, FaHeadset, FaEnvelope, FaPhone,
  FaUser, FaCheckCircle, FaPaperPlane, FaCar
} from "react-icons/fa"
import { MdSupportAgent } from "react-icons/md"
import "./CustomerSupport.css"

const ISSUE_TYPES = [
  "Order not received",
  "Product damaged",
  "Wrong product delivered",
  "Payment issue",
  "Order cancellation",
  "Tracking issue",
  "Other"
]

function CustomerSupport() {
  const navigate = useNavigate()
  const location = useLocation()

  // Pre-fill product info if navigated from ProductDetails
  const preProductName = location.state?.productName || ""
  const preProductId   = location.state?.productId   || ""

  const user = JSON.parse(localStorage.getItem("user") || "null")

  const [form, setForm] = useState({
    name:        user?.username || user?.name || "",
    email:       user?.email   || "",
    phone:       user?.phone   || "",
    issueType:   "",
    productName: preProductName,
    orderId:     "",
    message:     ""
  })

  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrorMsg("")
  }

  const validate = () => {
    if (!form.name.trim())    return "Please enter your name."
    if (!form.email.trim())   return "Please enter your email."
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address."
    if (!form.issueType)      return "Please select an issue type."
    if (!form.message.trim() || form.message.trim().length < 10)
      return "Message must be at least 10 characters."
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setErrorMsg(err); return }

    setSending(true)
    setErrorMsg("")

    try {
      const res = await axios.post(`${API_URL}/customer-support`, {
        ...form,
        productId: preProductId
      })

      if (res.data.success) {
        setSent(true)
      } else {
        setErrorMsg(res.data.message || "Something went wrong. Please try again.")
      }
    } catch {
      setErrorMsg("Server error. Please try again later.")
    }

    setSending(false)
  }

  /* ── Success Screen ── */
  if (sent) {
    return (
      <div className="cs-page">
        <div className="cs-blob cs-blob1" />
        <div className="cs-blob cs-blob2" />
        <div className="cs-success-wrap">
          <div className="cs-success-icon">
            <FaCheckCircle />
          </div>
          <h2 className="cs-success-title">Message Sent!</h2>
          <p className="cs-success-sub">
            We've received your query and our team will get back to you at
            <strong> {form.email}</strong> within 24–48 hours.
          </p>
          <button className="cs-back-home-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cs-page">
      <div className="cs-blob cs-blob1" />
      <div className="cs-blob cs-blob2" />

      {/* Back */}
      <button className="cs-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="cs-container">

        {/* Left Panel */}
        <div className="cs-left">
          <div className="cs-left-icon">
            <MdSupportAgent />
          </div>
          <h1 className="cs-left-title">Customer Support</h1>
          <p className="cs-left-sub">
            We're here to help! Describe your issue and our team will respond as soon as possible.
          </p>

          <div className="cs-info-cards">
            <div className="cs-info-card">
              <FaEnvelope className="cs-info-icon" />
              <div>
                <span className="cs-info-label">Email Us</span>
                <span className="cs-info-val">dheepancarsproject@gmail.com</span>
              </div>
            </div>
            <div className="cs-info-card">
              <FaPhone className="cs-info-icon" />
              <div>
                <span className="cs-info-label">Response Time</span>
                <span className="cs-info-val">Within 24–48 hours</span>
              </div>
            </div>
            <div className="cs-info-card">
              <FaCar className="cs-info-icon" />
              <div>
                <span className="cs-info-label">Support Hours</span>
                <span className="cs-info-val">Mon–Sat, 9 AM – 6 PM</span>
              </div>
            </div>
          </div>

          <div className="cs-policy-note">
            <strong>Note:</strong> We follow a <span>no-returns policy</span>. Please review your order carefully before placing it. For damaged or wrong items, attach photos in your message.
          </div>
        </div>

        {/* Right Form */}
        <div className="cs-right">
          <h2 className="cs-form-title">
            <FaHeadset className="cs-form-title-icon" /> Send us a Message
          </h2>

          <div className="cs-form">

            {/* Name + Email */}
            <div className="cs-row">
              <div className="cs-field">
                <label>Full Name <span className="cs-req">*</span></label>
                <div className="cs-input-wrap">
                  <FaUser className="cs-field-icon" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="cs-field">
                <label>Email <span className="cs-req">*</span></label>
                <div className="cs-input-wrap">
                  <FaEnvelope className="cs-field-icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Phone + Order ID */}
            <div className="cs-row">
              <div className="cs-field">
                <label>Phone Number</label>
                <div className="cs-input-wrap">
                  <FaPhone className="cs-field-icon" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="cs-field">
                <label>Order ID</label>
                <div className="cs-input-wrap">
                  <span className="cs-field-icon cs-hash">#</span>
                  <input
                    name="orderId"
                    type="text"
                    placeholder="Order ID (if any)"
                    value={form.orderId}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Issue Type */}
            <div className="cs-field cs-field-full">
              <label>Issue Type <span className="cs-req">*</span></label>
              <select
                name="issueType"
                value={form.issueType}
                onChange={handleChange}
                className="cs-select"
              >
                <option value="">— Select an issue —</option>
                {ISSUE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Product Name (pre-filled if from ProductDetails) */}
            <div className="cs-field cs-field-full">
              <label>Product Name</label>
              <div className="cs-input-wrap">
                <FaCar className="cs-field-icon" />
                <input
                  name="productName"
                  type="text"
                  placeholder="Related product (optional)"
                  value={form.productName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Message */}
            <div className="cs-field cs-field-full">
              <label>Message <span className="cs-req">*</span></label>
              <textarea
                name="message"
                placeholder="Describe your issue in detail..."
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="cs-textarea"
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="cs-error">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              className="cs-submit-btn"
              onClick={handleSubmit}
              disabled={sending}
            >
              {sending ? (
                <><span className="cs-btn-spinner" /> Sending...</>
              ) : (
                <><FaPaperPlane /> Send Message</>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSupport