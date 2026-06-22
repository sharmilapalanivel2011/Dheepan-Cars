import { useState } from "react"
import AdminSidebar from "../components/AdminSidebar"
import "./AdminAddProduct.css"

const BASE = "http://localhost:5000"

const CATEGORIES = [
  "RC Cars", "Diecast", "Bikes", "Trucks", "Muscle Cars", "General"
]

const BADGES = ["", "BESTSELLER", "TOP RATED", "NEW", "POPULAR", "HOT DEAL"]

const initialForm = {
  name: "",
  price: "",
  originalPrice: "",
  description: "",
  category: "",
  badge: "",
  stock: "",
  image: "",
  // ── Specs (for ProductComparison) ──
  rating: "",
  scale: "",
  material: "",
  topSpeed: "",
  battery: "",
  controlRange: "",
  warranty: "",
}

function AdminAddProduct() {
  const [form, setForm]           = useState(initialForm)
  const [imageMode, setImageMode] = useState("url")   // "url" | "upload"
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState({ text: "", type: "" })
  const [preview, setPreview]     = useState("")

  const showToast = (text, type = "success") => {
    setToast({ text, type })
    setTimeout(() => setToast({ text: "", type: "" }), 3500)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (name === "image" && imageMode === "url") setPreview(value)
  }

  // ── Image Upload to Cloudinary via /upload-image ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      const res  = await fetch(`${BASE}/upload-image`, { method: "POST", body: formData })
      const data = await res.json()
      if (data.success) {
        setForm(f => ({ ...f, image: data.url }))
        setPreview(data.url)
        showToast("✅ Image uploaded!")
      } else {
        showToast("❌ Upload failed", "error")
      }
    } catch {
      showToast("❌ Upload error", "error")
    }
    setUploading(false)
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim())     return showToast("⚠️ Product name required", "error")
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
                               return showToast("⚠️ Valid price required", "error")
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
                               return showToast("⚠️ Valid stock required", "error")
    if (!form.category)        return showToast("⚠️ Category select pannunga", "error")
    if (!form.image.trim())    return showToast("⚠️ Image required", "error")

    setSaving(true)
    try {
      // ── Duplicate check ──
      const checkRes  = await fetch(`${BASE}/products`)
      const allProds  = await checkRes.json()
      const duplicate = allProds.find(
        p => p.name.trim().toLowerCase() === form.name.trim().toLowerCase()
      )
      if (duplicate) {
        showToast("⚠️ Intha peyarla product already irukku!", "error")
        setSaving(false)
        return
      }

      // ── Save ──
      const payload = {
        name:          form.name.trim(),
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : Math.round(Number(form.price) * 1.3),
        description:   form.description.trim(),
        category:      form.category,
        badge:         form.badge || null,
        stock:         Number(form.stock),
        image:         form.image.trim(),
        // ── Specs ──
        rating:        form.rating ? Number(form.rating) : null,
        scale:         form.scale.trim() || "N/A",
        material:      form.material.trim() || "N/A",
        speed:         form.topSpeed.trim() || "N/A",
        battery:       form.battery.trim() || "N/A",
        range:         form.controlRange.trim() || "N/A",
        warranty:      form.warranty.trim() || "N/A",
      }

      const res  = await fetch(`${BASE}/add-product`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      })
      const data = await res.json()

      if (data.success) {
        showToast("✅ Product added!")
        setForm(initialForm)
        setPreview("")
      } else {
        showToast("❌ Add failed", "error")
      }
    } catch {
      showToast("❌ Server error", "error")
    }
    setSaving(false)
  }

  const discount = form.price && form.originalPrice
    ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
    : null

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">

        {/* Header */}
        <div className="aap-header">
          <div>
            <h1>➕ Add New Product</h1>
            <p className="aap-subtitle">New Products saved in DB  — It will automatically showed in Products page </p>
          </div>
        </div>

        {/* Toast */}
        {toast.text && (
          <div className={`stock-toast ${toast.type}`}>{toast.text}</div>
        )}

        <div className="aap-layout">

          {/* ── Form ── */}
          <form className="aap-form" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="aap-field">
              <label>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. RC Lamborghini Aventador"
                maxLength={100}
              />
            </div>

            {/* Price row */}
            <div className="aap-row">
              <div className="aap-field">
                <label>Selling Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500"
                />
              </div>
              <div className="aap-field">
                <label>Original Price (₹) <span className="aap-optional">optional</span></label>
                <input
                  name="originalPrice"
                  type="number"
                  min="1"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="Auto: price × 1.3"
                />
                {discount !== null && discount > 0 && (
                  <span className="aap-discount-hint">{discount}% off kaatuthu</span>
                )}
              </div>
            </div>

            {/* Stock + Category row */}
            <div className="aap-row">
              <div className="aap-field">
                <label>Stock Quantity *</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="aap-field">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">— Select category —</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Badge */}
            <div className="aap-field">
              <label>Badge <span className="aap-optional">optional</span></label>
              <div className="aap-badge-group">
                {BADGES.map(b => (
                  <button
                    key={b}
                    type="button"
                    className={`aap-badge-btn ${form.badge === b ? "active" : ""}`}
                    onClick={() => setForm(f => ({ ...f, badge: b }))}
                  >
                    {b || "None"}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="aap-field">
              <label>Description <span className="aap-optional">optional</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product details, features..."
                rows={3}
                maxLength={300}
              />
              <span className="aap-char-count">{form.description.length}/300</span>
            </div>

            {/* ── SPECS SECTION ── */}
            <div className="aap-section-title">📊 Product Specs <span className="aap-optional">(for Compare page)</span></div>

            {/* Rating + Scale */}
            <div className="aap-row">
              <div className="aap-field">
                <label>Rating <span className="aap-optional">(0–5)</span></label>
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="e.g. 4.5"
                />
              </div>
              <div className="aap-field">
                <label>Scale <span className="aap-optional">e.g. 1:18</span></label>
                <input
                  name="scale"
                  value={form.scale}
                  onChange={handleChange}
                  placeholder="1:18  or  N/A"
                />
              </div>
            </div>

            {/* Material + Warranty */}
            <div className="aap-row">
              <div className="aap-field">
                <label>Material</label>
                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder="e.g. Die-cast Metal"
                />
              </div>
              <div className="aap-field">
                <label>Warranty</label>
                <input
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  placeholder="e.g. 6 months"
                />
              </div>
            </div>

            {/* Top Speed + Battery (RC only) */}
            <div className="aap-row">
              <div className="aap-field">
                <label>Top Speed <span className="aap-optional">RC cars only</span></label>
                <input
                  name="topSpeed"
                  value={form.topSpeed}
                  onChange={handleChange}
                  placeholder="e.g. 45 km/h  or  N/A"
                />
              </div>
              <div className="aap-field">
                <label>Battery <span className="aap-optional">RC cars only</span></label>
                <input
                  name="battery"
                  value={form.battery}
                  onChange={handleChange}
                  placeholder="e.g. 1200mAh  or  N/A"
                />
              </div>
            </div>

            {/* Control Range */}
            <div className="aap-field">
              <label>Control Range <span className="aap-optional">RC cars only</span></label>
              <input
                name="controlRange"
                value={form.controlRange}
                onChange={handleChange}
                placeholder="e.g. 80m  or  N/A"
              />
            </div>

            {/* Image */}
            <div className="aap-field">
              <label>Product Image *</label>
              <div className="aap-img-mode-toggle">
                <button
                  type="button"
                  className={imageMode === "url" ? "active" : ""}
                  onClick={() => setImageMode("url")}
                >🔗 URL</button>
                <button
                  type="button"
                  className={imageMode === "upload" ? "active" : ""}
                  onClick={() => setImageMode("upload")}
                >☁️ Upload</button>
              </div>

              {imageMode === "url" ? (
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://... or /images/product.jpg"
                />
              ) : (
                <div className="aap-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    id="img-upload"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="img-upload" className="aap-upload-label">
                    {uploading ? "⏳ Uploading..." : "📁 Choose Image"}
                  </label>
                  {form.image && (
                    <span className="aap-upload-done">✅ Uploaded</span>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="aap-submit-btn"
              disabled={saving || uploading}
            >
              {saving ? "⏳ Saving..." : "✅ Add Product"}
            </button>

          </form>

          {/* ── Live Preview ── */}
          <div className="aap-preview">
            <h3>Live Preview</h3>
            <div className="aap-preview-card">
              {form.badge && (
                <div className="aap-prev-badge">{form.badge}</div>
              )}
              <div className="aap-prev-img">
                {preview ? (
                  <img src={preview} alt="preview" />
                ) : (
                  <span className="aap-prev-placeholder">🖼️</span>
                )}
              </div>
              <div className="aap-prev-info">
                <span className="aap-prev-category">{form.category || "Category"}</span>
                <h4>{form.name || "Product Name"}</h4>
                <div className="aap-prev-price">
                  <span>₹{form.price ? Number(form.price).toLocaleString() : "—"}</span>
                  {form.originalPrice && (
                    <span className="aap-prev-orig">₹{Number(form.originalPrice).toLocaleString()}</span>
                  )}
                </div>
                {form.rating && (
                  <span className="aap-prev-rating">⭐ {form.rating}</span>
                )}
                <p className="aap-prev-desc">{form.description || "Description..."}</p>

                {/* Specs preview */}
                {(form.scale || form.material || form.warranty) && (
                  <div className="aap-prev-specs">
                    {form.scale    && <span>📐 {form.scale}</span>}
                    {form.material && <span>🔧 {form.material}</span>}
                    {form.warranty && <span>🛡️ {form.warranty}</span>}
                    {form.topSpeed && form.topSpeed !== "N/A" && <span>⚡ {form.topSpeed}</span>}
                    {form.battery  && form.battery !== "N/A"  && <span>🔋 {form.battery}</span>}
                    {form.controlRange && form.controlRange !== "N/A" && <span>📡 {form.controlRange}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminAddProduct