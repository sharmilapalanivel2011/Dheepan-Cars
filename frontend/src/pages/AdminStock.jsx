import { API_URL } from "../config"
import { useEffect, useState, useCallback } from "react"
import AdminSidebar from "../components/AdminSidebar"
import "./AdminStock.css"

const BASE = import.meta.env.VITE_API_URL;

// ── Static products list (migrate பண்ண) ──
const STATIC_PRODUCTS = [
  { name: "RC Lamborghini Aventador", price: 2500, originalPrice: 3500, desc: "High performance remote control supercar with turbo boost.", image: "/images/RC Lamborghini Aventador blackp1.jpg", badge: "BESTSELLER", category: "RC Cars" },
  { name: "BMW M4 Diecast Model", price: 1200, originalPrice: 1800, desc: "Premium diecast collectible model, 1:18 scale.", image: "/images/BMW M4 Diecast Modelp2.jpg", badge: "TOP RATED", category: "Diecast" },
  { name: "Nissan GT‑R R35", price: 1200, desc: "Premium diecast collectible model.", image: "/images/Nissan GT‑R R35p3.jpg", category: "Diecast" },
  { name: "Miniature Ducati Bike", price: 900, desc: "Detailed scale model of Ducati superbike.", image: "/images/Miniature Ducati Bikep4.jpg", category: "Diecast" },
  { name: "RC Monster Truck", price: 3000, desc: "Powerful off-road remote control monster truck.", image: "/images/RC Monster Truckp5.jpg", category: "RC Cars" },
  { name: "Ferrari 488 GTB Diecast", price: 1500, desc: "Luxury Ferrari scale model for collectors.", image: "/images/Ferrari 488 GTB Diecastp6.jpg", category: "Diecast" },
  { name: "RC Drift Racing Car", price: 2200, desc: "High speed RC drift car with smooth handling.", image: "/images/RC Drift Racing Carp7.jpg", category: "RC Cars" },
  { name: "Miniature Yamaha R1", price: 950, desc: "Premium Yamaha R1 miniature bike model.", image: "/images/Miniature Yamaha R1p8.jpg", category: "Diecast" },
  { name: "RC Buggy Off Road", price: 2800, desc: "Durable off-road buggy with strong suspension.", image: "/images/RC Buggy Off Roadp9.jpg", category: "RC Cars" },
  { name: "Porsche 911 Diecast", price: 1700, desc: "Classic Porsche collectible miniature model.", image: "/images/Porsche 911 Diecastp10.jpg", category: "Diecast" },
  { name: "Nissan GT-R R35 RC Car", price: 2600, desc: "High performance RC sports car with aggressive design.", image: "/images/Nissan GT-R R35 RC Carp11.jpg", category: "RC Cars" },
  { name: "Audi R8 V10 Diecast", price: 1800, desc: "Premium diecast model of the iconic Audi R8 supercar.", image: "/images/Audi R8 V10 Diecastp12.jpg", category: "Diecast" },
  { name: "Pulsar Bike", price: 850, originalPrice: 1100, desc: "Detailed Bajaj Pulsar scale model for bike lovers.", image: "/images/pulsar bike.jpg", category: "Diecast" },
  { name: "Mahindra Thar RC Car", price: 2700, originalPrice: 3500, desc: "Rugged 4x4 remote control Thar with off-road capability.", image: "/images/thar.jpg", badge: "NEW", category: "RC Cars" },
  { name: "Kawasaki Ninja", price: 980, originalPrice: 1300, desc: "Premium Kawasaki Ninja scale model with sport finish.", image: "/images/kawasaki bike.jpg", category: "Diecast" },
  { name: "Royal Enfield Bullet", price: 920, originalPrice: 1200, desc: "Classic Royal Enfield Bullet collectible miniature model.", image: "/images/royal enfield.jpg", badge: "POPULAR", category: "Diecast" },
  { name: "RAM 1500 TRX RC Car", price: 3200, originalPrice: 4200, desc: "High-performance RC pickup truck with monster suspension.", image: "/images/RAM 1500 TRX.jpg", badge: "NEW", category: "RC Cars" },
  { name: "CAT 797F Dump Truck Diecast", price: 2200, originalPrice: 2900, desc: "Iconic CAT mining dump truck premium diecast model.", image: "/images/CAT 797F Dump Truck.jpg", category: "Diecast" },
  { name: "Ford F-150 Raptor RC Car", price: 3000, originalPrice: 3900, desc: "Powerful off-road RC Ford Raptor with 4WD drive system.", image: "/images/Ford F-150 Raptor.jpg", badge: "BESTSELLER", category: "RC Cars" },
  { name: "Ferrari LaFerrari Diecast", price: 2500, originalPrice: 3200, desc: "Luxury Ferrari LaFerrari hybrid supercar diecast collectible.", image: "/images/Ferrari LaFerrari.jpg", badge: "TOP RATED", category: "Diecast" },
  { name: "Tesla Model S Plaid Diecast", price: 1900, originalPrice: 2500, desc: "Premium Tesla Model S Plaid electric car scale model.", image: "/images/Tesla Model S Plaid.jpg", category: "Diecast" },
  { name: "Tata Prima Truck Diecast", price: 1600, originalPrice: 2100, desc: "Detailed Tata Prima heavy truck diecast collectible.", image: "/images/Tata Prima.jpg", category: "Diecast" },
  { name: "MAN TGX Truck Diecast", price: 1750, originalPrice: 2300, desc: "European MAN TGX long-haul truck premium scale model.", image: "/images/MAN TGX.jpg", category: "Diecast" },
  { name: "Scania R730 Truck Diecast", price: 1850, originalPrice: 2400, desc: "Iconic Scania R730 V8 truck collector's diecast model.", image: "/images/Scania R730.jpg", badge: "POPULAR", category: "Diecast" },
  { name: "Jeep Wrangler Rubicon RC Car", price: 2900, originalPrice: 3800, desc: "Rugged RC Jeep Wrangler with rock-crawling capability.", image: "/images/Jeep Wrangler Rubicon.jpg", category: "RC Cars" },
  { name: "Volvo FH16 Truck Diecast", price: 1950, originalPrice: 2550, desc: "Premium Volvo FH16 750hp truck diecast scale model.", image: "/images/Volvo FH16.jpg", category: "Diecast" },
  { name: "TVS Apache RR 310 Miniature", price: 880, originalPrice: 1150, desc: "Detailed TVS Apache RR 310 race bike miniature model.", image: "/images/TVS Apache RR 310.jpg", category: "Diecast" },
  { name: "BMW S1000RR Miniature", price: 1050, originalPrice: 1400, desc: "Premium BMW S1000RR superbike precision scale model.", image: "/images/BMW M4 Diecast Modelp2.jpg", badge: "TOP RATED", category: "Diecast" },
  { name: "Suzuki Hayabusa Miniature", price: 1000, originalPrice: 1350, desc: "Iconic Suzuki Hayabusa GSX1300R collector's miniature.", image: "/images/Suzuki Hayabusa.jpg", badge: "POPULAR", category: "Diecast" },
  { name: "Honda CBR1000RR Miniature", price: 970, originalPrice: 1280, desc: "Precision Honda CBR1000RR Fireblade scale model.", image: "/images/Honda CBR1000RR.jpg", category: "Diecast" },
  { name: "KTM Duke 390 Miniature", price: 840, originalPrice: 1100, desc: "Sporty KTM Duke 390 detailed miniature bike model.", image: "/images/KTM Duke 390.jpg", category: "Diecast" },
  { name: "Yamaha YZF-R1 Miniature", price: 990, originalPrice: 1320, desc: "High-detail Yamaha YZF-R1 MotoGP replica scale model.", image: "/images/Yamaha YZF-R1.jpg", category: "Diecast" },
  { name: "Ford Mustang GT Diecast", price: 1650, originalPrice: 2150, desc: "Classic Ford Mustang GT500 premium diecast collectible.", image: "/images/Ford Mustang GT.jpeg", category: "Diecast" },
  { name: "Chevrolet Camaro SS Diecast", price: 1700, originalPrice: 2200, desc: "Iconic Chevrolet Camaro SS muscle car diecast model.", image: "/images/Chevrolet Camaro SS.jpg", category: "Diecast" },
  { name: "Honda CBR1000RR-R Fireblade", price: 1080, originalPrice: 1450, desc: "Precision Honda CBR1000RR-R SP superbike collector's miniature.", image: "/images/Honda CBR1000RR-R Fireblade.jpg", badge: "TOP RATED", category: "Diecast" },
  { name: "Yamaha RX 100 Miniature", price: 750, originalPrice: 980, desc: "Iconic vintage Yamaha RX 100 classic bike miniature model.", image: "/images/RX 100.jpg", badge: "POPULAR", category: "Diecast" },
]

function AdminStock() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editStock, setEditStock] = useState("")
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState({ text: "", type: "" })
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState("all")
  const [sortBy, setSortBy]       = useState("name")
  const [sortDir, setSortDir]     = useState("asc")
  const [bulkMode, setBulkMode]   = useState(false)
  const [selected, setSelected]   = useState([])
  const [bulkValue, setBulkValue] = useState("")
  const [history, setHistory]     = useState([])
  const [migrating, setMigrating] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/products`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const arr = Array.isArray(data) ? data : (data.products || [])
      setProducts(arr)
    } catch (err) {
      console.error("Fetch error:", err)
      showToast("❌ Products load aagala — server running aa check pannu!", "error")
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const showToast = (text, type = "success") => {
    setToast({ text, type })
    setTimeout(() => setToast({ text: "", type: "" }), 3500)
  }

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortBy(col); setSortDir("asc") }
  }

  const handleEdit = (p) => {
    setEditingId(p._id)
    setEditStock(String(p.stock ?? 0))
  }

  const handleSave = async (id) => {
    const val = Number(editStock)
    if (editStock === "" || isNaN(val) || val < 0) {
      showToast("⚠️ Valid stock value enter pannunga!", "error")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`${BASE}/admin/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: val })
      })
      const data = await res.json()
      if (data.success) {
        const prev = products.find(p => p._id === id)?.stock ?? 0
        setHistory(h => [...h, { id, prev }])
        setProducts(ps => ps.map(p => p._id === id ? { ...p, stock: val } : p))
        showToast(`✅ Stock updated → ${val}`)
        setEditingId(null)
      } else {
        showToast(`❌ ${data.message || "Update failed"}`, "error")
      }
    } catch (err) {
      showToast("❌ Server error", "error")
    }
    setSaving(false)
  }

  const handleUndo = async () => {
    if (!history.length) return
    const last = history[history.length - 1]
    setSaving(true)
    try {
      const res = await fetch(`${BASE}/admin/stock/${last.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: last.prev })
      })
      const data = await res.json()
      if (data.success) {
        setProducts(ps => ps.map(p => p._id === last.id ? { ...p, stock: last.prev } : p))
        setHistory(h => h.slice(0, -1))
        showToast(`↩️ Stock restored → ${last.prev}`)
      }
    } catch { showToast("❌ Undo failed", "error") }
    setSaving(false)
  }

  const quickAdjust = async (product, delta) => {
    const newStock = Math.max(0, (product.stock ?? 0) + delta)
    setSaving(true)
    try {
      const res = await fetch(`${BASE}/admin/stock/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock })
      })
      const data = await res.json()
      if (data.success) {
        setHistory(h => [...h, { id: product._id, prev: product.stock ?? 0 }])
        setProducts(ps => ps.map(p => p._id === product._id ? { ...p, stock: newStock } : p))
        showToast(`${delta > 0 ? "➕" : "➖"} Stock: ${newStock}`)
      }
    } catch { showToast("❌ Error", "error") }
    setSaving(false)
  }

  const handleBulkUpdate = async () => {
  const val = Number(bulkValue)
  if (!selected.length)      { showToast("⚠️ Please Select the Product", "error"); return }
  if (isNaN(val) || val < 0) { showToast("⚠️ Please Enter the valid Value", "error"); return }
  setSaving(true)
  const results = await Promise.all(selected.map(async id => {
    try {
      // ── Current stock add  ──
      const currentStock = products.find(p => p._id === id)?.stock ?? 0
      const newStock = currentStock + val   

      const res = await fetch(`${BASE}/admin/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock })   
      })
      const d = await res.json()
      return d.success ? { id, newStock } : null
    } catch { return null }
  }))

  const successful = results.filter(Boolean)
  if (successful.length > 0) {
    setProducts(ps => ps.map(p => {
      const match = successful.find(r => r.id === p._id)
      return match ? { ...p, stock: match.newStock } : p   // <-- each product's newStock
    }))
  }
  showToast(`✅ ${successful.length}/${selected.length} products → +${val} stock added`)
  setSelected([]); setBulkMode(false); setBulkValue("")
  setSaving(false)
}





  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this Product??")) return
    try {
      const res = await fetch(`${BASE}/admin/product/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setProducts(ps => ps.filter(p => p._id !== id))
        showToast("🗑️ Product deleted!")
      } else {
        showToast("❌ Delete failed", "error")
      }
    } catch { showToast("❌ Server error", "error") }
  }

  // ── MIGRATE: Static 36 products → DB ──
  const handleMigrate = async () => {
    if (!window.confirm(
      `36 static products DB la import pannattuma?\n\nAlready DB la irukkadhaa skip aagum — duplicate varaadhu.\nStock default: 0 aa set aagum, appuram edit pannalaam.`
    )) return

    setMigrating(true)
    try {
      const res = await fetch(`${BASE}/admin/migrate-static`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: STATIC_PRODUCTS })
      })
      const data = await res.json()
      if (data.success) {
        showToast(`✅ ${data.added} products added, ${data.skipped} already existed (skipped)`)
        fetchProducts()
      } else {
        showToast(`❌ Migration failed: ${data.error || "server error"}`, "error")
      }
    } catch {
      showToast("❌ Server error — migrate-static route check pannu", "error")
    }
    setMigrating(false)
  }

  const getStatus = (stock) => {
    if (stock === 0)  return { label: "Out of Stock", cls: "stock-out", icon: "❌" }
    if (stock <= 5)   return { label: "Low Stock",    cls: "stock-low", icon: "⚠️" }
    if (stock <= 15)  return { label: "Medium",       cls: "stock-med", icon: "🟡" }
    return                   { label: "In Stock",     cls: "stock-ok",  icon: "✅" }
  }

  const processed = products
    .filter(p => {
      const q = search.toLowerCase()
      const matchSearch = (p.name || "").toLowerCase().includes(q) ||
                          (p.category || "").toLowerCase().includes(q)
      const s = p.stock ?? 0
      const matchFilter =
        filter === "all"    ? true :
        filter === "low"    ? (s > 0 && s <= 5) :
        filter === "out"    ? s === 0 :
        filter === "medium" ? (s > 5 && s <= 15) : true
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      let av, bv
      if (sortBy === "stock")      { av = a.stock ?? 0;    bv = b.stock ?? 0 }
      else if (sortBy === "price") { av = a.price ?? 0;    bv = b.price ?? 0 }
      else                         { av = (a.name || "").toLowerCase(); bv = (b.name || "").toLowerCase() }
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ?  1 : -1
      return 0
    })

  const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0)
  const outCount   = products.filter(p => (p.stock ?? 0) === 0).length
  const lowCount   = products.filter(p => { const s = p.stock ?? 0; return s > 0 && s <= 5 }).length
  const medCount   = products.filter(p => { const s = p.stock ?? 0; return s > 5 && s <= 15 }).length

  const SortIcon = ({ col }) => (
    <span className="sort-icon">
      {sortBy === col ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
    </span>
  )

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">

        {/* Header */}
        <div className="stock-header">
          <div>
            <h1>📦 Stock Management</h1>
            <p className="stock-subtitle">Real-time inventory control & updates</p>
          </div>
          <div className="header-actions">
            {history.length > 0 && (
              <button className="undo-btn" onClick={handleUndo} disabled={saving}>
                ↩️ Undo ({history.length})
              </button>
            )}

            {/* ── MIGRATE BUTTON — static products DB la illana kaatuthu ── */}
            {products.length < 36 && (
              <button
                className="refresh-btn"
                onClick={handleMigrate}
                disabled={migrating || saving}
                style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
              >
                {migrating ? "⏳ Importing..." : "📥 Import Static Products"}
              </button>
            )}

            <button
              className={`bulk-toggle-btn ${bulkMode ? "active" : ""}`}
              onClick={() => { setBulkMode(b => !b); setSelected([]) }}
            >
              {bulkMode ? "✕ Cancel Bulk" : "⚡ Bulk Edit"}
            </button>
            <button className="refresh-btn" onClick={fetchProducts} disabled={loading}>
              {loading ? "⏳" : "🔄"} Refresh
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast.text && (
          <div className={`stock-toast ${toast.type}`}>{toast.text}</div>
        )}

        {/* Migration hint — DB la products illana */}
        {!loading && products.length === 0 && (
          <div className="stock-migrate-hint">
            <p>⚠️ DB la products இல்ல — <strong>📥 Import Static Products</strong> button click பண்ணு</p>
            <p>36 products DB la save ஆகும், appuram stock edit பண்ணலாம்</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="stock-summary">
          {[
            { icon: "🏪", label: "Total Products",   val: products.length, cls: "",       fkey: "all"    },
            { icon: "📊", label: "Total Stock Units", val: totalStock,      cls: "",       fkey: "all"    },
            { icon: "🟡", label: "Medium Stock",      val: medCount,        cls: "med",    fkey: "medium" },
            { icon: "⚠️", label: "Low Stock",         val: lowCount,        cls: "warn",   fkey: "low"    },
            { icon: "❌", label: "Out of Stock",      val: outCount,        cls: "danger", fkey: "out"    },
          ].map(c => (
            <div
              key={c.label}
              className={`stock-summary-card ${c.cls} ${filter === c.fkey ? "card-active" : ""}`}
              onClick={() => setFilter(c.fkey)}
            >
              <span className="sum-icon">{c.icon}</span>
              <div>
                <p className="sum-label">{c.label}</p>
                <h3>{c.val}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Panel */}
        {bulkMode && (
          <div className="bulk-panel">
            <span className="bulk-info">
              {selected.length} product{selected.length !== 1 ? "s" : ""} selected
            </span>
            <input
              type="number"
              className="bulk-input"
              placeholder="Add stock quantity..."
              value={bulkValue}
              min="0"
              onChange={e => setBulkValue(e.target.value)}
            />
            <button className="bulk-apply-btn" onClick={handleBulkUpdate} disabled={saving}>
              ⚡ Apply to Selected
            </button>
            <button
              className="bulk-select-all"
              onClick={() =>
                selected.length === processed.length
                  ? setSelected([])
                  : setSelected(processed.map(p => p._id))
              }
            >
              {selected.length === processed.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        )}

        {/* Search + Filter */}
        <div className="stock-controls">
          <input
            className="stock-search"
            placeholder="🔍 Search by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="stock-filter-group">
            {[
              { key: "all",    label: "All"       },
              { key: "medium", label: "🟡 Medium" },
              { key: "low",    label: "⚠️ Low"    },
              { key: "out",    label: "❌ Out"     },
            ].map(f => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="stock-loading">
            <div className="loading-spinner" />
            <p>Products is loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="stock-empty">
            <p>😕 No Products in DB</p>
            <small>Above <strong>📥 Import Static Products</strong>Click The Button </small>
          </div>
        ) : processed.length === 0 ? (
          <div className="stock-empty">
            <p>🔍 No results</p>
            <small>Search or filter </small>
          </div>
        ) : (
          <div className="stock-table-wrapper">
            <table className="stock-table">
              <thead>
                <tr>
                  {bulkMode && (
                    <th className="cb-col">
                      <input
                        type="checkbox"
                        checked={selected.length === processed.length && processed.length > 0}
                        onChange={() =>
                          selected.length === processed.length
                            ? setSelected([])
                            : setSelected(processed.map(p => p._id))
                        }
                      />
                    </th>
                  )}
                  <th className="sortable" onClick={() => toggleSort("name")}>
                    Product <SortIcon col="name" />
                  </th>
                  <th>Category</th>
                  <th className="sortable" onClick={() => toggleSort("price")}>
                    Price <SortIcon col="price" />
                  </th>
                  <th className="sortable" onClick={() => toggleSort("stock")}>
                    Stock <SortIcon col="stock" />
                  </th>
                  <th>Status</th>
                  <th>Quick ±</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processed.map(product => {
                  const status     = getStatus(product.stock ?? 0)
                  const isEditing  = editingId === product._id
                  const isSelected = selected.includes(product._id)

                  return (
                    <tr
                      key={product._id}
                      className={[
                        isEditing  ? "editing-row"  : "",
                        isSelected ? "selected-row" : ""
                      ].join(" ")}
                    >
                      {bulkMode && (
                        <td className="cb-col">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              setSelected(sel =>
                                isSelected
                                  ? sel.filter(id => id !== product._id)
                                  : [...sel, product._id]
                              )
                            }
                          />
                        </td>
                      )}

                      <td>
                        <div className="product-cell">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumb"
                            onError={e => {
                              e.target.onerror = null
                              e.target.src = "https://placehold.co/44x44/1a1a1a/444?text=?"
                            }}
                          />
                          <div>
                            <p className="product-name">{product.name}</p>
                            <p className="product-id">#{product._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-tag">{product.category || "—"}</span>
                      </td>

                      <td className="price-cell">
                        ₹{product.price?.toLocaleString() || "—"}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="stock-input"
                            value={editStock}
                            min="0"
                            autoFocus
                            onChange={e => setEditStock(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter")  handleSave(product._id)
                              if (e.key === "Escape") setEditingId(null)
                            }}
                          />
                        ) : (
                          <span
                            className="stock-number"
                            title="Click to edit"
                            onClick={() => handleEdit(product)}
                          >
                            {product.stock ?? 0}
                          </span>
                        )}
                      </td>

                      <td>
                        <span className={`stock-badge ${status.cls}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>

                      <td>
                        {!isEditing && (
                          <div className="quick-btns">
                            <button
                              className="quick-btn minus"
                              onClick={() => quickAdjust(product, -1)}
                              disabled={saving || (product.stock ?? 0) === 0}
                              title="−1"
                            >−</button>
                            <span className="quick-count">{product.stock ?? 0}</span>
                            <button
                              className="quick-btn plus"
                              onClick={() => quickAdjust(product, +1)}
                              disabled={saving}
                              title="+1"
                            >+</button>
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="action-btns">
                          {isEditing ? (
                            <>
                              <button
                                className="save-btn"
                                onClick={() => handleSave(product._id)}
                                disabled={saving}
                              >
                                {saving ? "⏳" : "💾 Save"}
                              </button>
                              <button
                                className="cancel-btn"
                                onClick={() => setEditingId(null)}
                              >✕</button>
                            </>
                          ) : (
                            <>
                              <button
                                className="edit-btn"
                                onClick={() => handleEdit(product)}
                              >✏️ Edit</button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDelete(product._id)}
                              >🗑️</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="table-footer">
              Showing {processed.length} of {products.length} products
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStock