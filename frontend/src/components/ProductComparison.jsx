import { API_URL } from '../config';
import { useState, useEffect, useContext } from "react"
import { FaStar, FaTimes, FaPlus, FaShoppingCart, FaBolt, FaCheckCircle, FaTrophy, FaBalanceScale } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import "./ProductComparison.css"

const BASE = import.meta.env.VITE_API_URL;

// ─── Static product list (unchanged) ─────────────────────────────────────────
const staticProducts = [
  { id: 1,  name: "RC Lamborghini Aventador",   price: 2500, originalPrice: 3500, rating: 4.2, image: "/images/RC Lamborghini Aventador blackp1.jpg", badge: "BESTSELLER", category: "RC Cars",  speed: "45 km/h",  battery: "1200mAh", range: "80m",  scale: "1:14", material: "ABS Plastic",    warranty: "6 months"  },
  { id: 2,  name: "BMW M4 Diecast Model",        price: 1200, originalPrice: 1800, rating: 4.8, image: "/images/BMW M4 Diecast Modelp2.jpg",           badge: "TOP RATED", category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 3,  name: "Nissan GT‑R R35",             price: 1200, originalPrice: 1560, rating: 5,   image: "/images/Nissan GT‑R R35p3.jpg",                 badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 5,  name: "RC Monster Truck",            price: 3000, originalPrice: 4000, rating: 5,   image: "/images/RC Monster Truckp5.jpg",                badge: null,        category: "RC Cars",  speed: "55 km/h",  battery: "2400mAh", range: "120m", scale: "1:10", material: "ABS + Rubber",   warranty: "6 months"  },
  { id: 7,  name: "RC Drift Racing Car",         price: 2200, originalPrice: 2800, rating: 4,   image: "/images/RC Drift Racing Carp7.jpg",             badge: null,        category: "RC Cars",  speed: "40 km/h",  battery: "1000mAh", range: "70m",  scale: "1:16", material: "ABS Plastic",    warranty: "6 months"  },
  { id: 9,  name: "RC Buggy Off Road",           price: 2800, originalPrice: 3500, rating: 5,   image: "/images/RC Buggy Off Roadp9.jpg",               badge: null,        category: "RC Cars",  speed: "50 km/h",  battery: "2000mAh", range: "100m", scale: "1:12", material: "ABS + Metal",    warranty: "6 months"  },
  { id: 10, name: "Porsche 911 Diecast",         price: 1700, originalPrice: 2200, rating: 4,   image: "/images/Porsche 911 Diecastp10.jpg",            badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 12, name: "Audi R8 V10 Diecast",        price: 1800, originalPrice: 2400, rating: 4,   image: "/images/Audi R8 V10 Diecastp12.jpg",           badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 13, name: "Pulsar Bike Miniature",       price: 850,  originalPrice: 1100, rating: 4.3, image: "/images/pulsar bike.jpg",                       badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 14, name: "Mahindra Thar RC Car",        price: 2700, originalPrice: 3500, rating: 4.6, image: "/images/thar.jpg",                              badge: "NEW",       category: "RC Cars",  speed: "28 km/h",  battery: "1500mAh", range: "70m",  scale: "1:12", material: "ABS + Rubber",   warranty: "6 months"  },
  { id: 15, name: "Kawasaki Ninja Miniature",    price: 980,  originalPrice: 1300, rating: 4.5, image: "/images/kawasaki bike.jpg",                     badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 16, name: "Royal Enfield Bullet Miniature", price: 920, originalPrice: 1200, rating: 4.7, image: "/images/royal enfield.jpg",                  badge: "POPULAR",   category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 17, name: "RAM 1500 TRX RC Car",         price: 3200, originalPrice: 4200, rating: 4.7, image: "/images/RAM 1500 TRX.jpg",                     badge: "NEW",       category: "RC Cars",  speed: "32 km/h",  battery: "1800mAh", range: "80m",  scale: "1:12", material: "ABS + Rubber",   warranty: "6 months"  },
  { id: 18, name: "CAT 797F Dump Truck Diecast", price: 2200, originalPrice: 2900, rating: 4.5, image: "/images/CAT 797F Dump Truck.jpg",              badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:50", material: "Die-cast Metal", warranty: "12 months" },
  { id: 19, name: "Ford F-150 Raptor RC Car",    price: 3000, originalPrice: 3900, rating: 4.8, image: "/images/Ford F-150 Raptor.jpg",                badge: "BESTSELLER",category: "RC Cars",  speed: "30 km/h",  battery: "1600mAh", range: "80m",  scale: "1:12", material: "ABS + Metal",    warranty: "6 months"  },
  { id: 20, name: "Ferrari LaFerrari Diecast",   price: 2500, originalPrice: 3200, rating: 4.9, image: "/images/Ferrari LaFerrari.jpg",                badge: "TOP RATED", category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 21, name: "Tesla Model S Plaid Diecast", price: 1900, originalPrice: 2500, rating: 4.6, image: "/images/Tesla Model S Plaid.jpg",              badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 22, name: "Tata Prima Truck Diecast",    price: 1600, originalPrice: 2100, rating: 4.3, image: "/images/Tata Prima.jpg",                       badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:32", material: "Die-cast Metal", warranty: "12 months" },
  { id: 23, name: "MAN TGX Truck Diecast",       price: 1750, originalPrice: 2300, rating: 4.4, image: "/images/MAN TGX.jpg",                          badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:32", material: "Die-cast Metal", warranty: "12 months" },
  { id: 24, name: "Scania R730 Truck Diecast",   price: 1850, originalPrice: 2400, rating: 4.6, image: "/images/Scania R730.jpg",                      badge: "POPULAR",   category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:32", material: "Die-cast Metal", warranty: "12 months" },
  { id: 25, name: "Jeep Wrangler Rubicon RC Car",price: 2900, originalPrice: 3800, rating: 4.7, image: "/images/Jeep Wrangler Rubicon.jpg",            badge: null,        category: "RC Cars",  speed: "25 km/h",  battery: "1600mAh", range: "75m",  scale: "1:12", material: "ABS + Rubber",   warranty: "6 months"  },
  { id: 26, name: "Volvo FH16 Truck Diecast",    price: 1950, originalPrice: 2550, rating: 4.5, image: "/images/Volvo FH16.jpg",                       badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:32", material: "Die-cast Metal", warranty: "12 months" },
  { id: 27, name: "TVS Apache RR 310 Miniature", price: 880,  originalPrice: 1150, rating: 4.4, image: "/images/TVS Apache RR 310.jpg",                badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 28, name: "BMW S1000RR Miniature",        price: 1050, originalPrice: 1400, rating: 4.8, image: "/images/BMW M4 Diecast Modelp2.jpg",           badge: "TOP RATED", category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 29, name: "Suzuki Hayabusa Miniature",   price: 1000, originalPrice: 1350, rating: 4.7, image: "/images/Suzuki Hayabusa.jpg",                  badge: "POPULAR",   category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 30, name: "Honda CBR1000RR Miniature",   price: 970,  originalPrice: 1280, rating: 4.5, image: "/images/Honda CBR1000RR.jpg",                  badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 31, name: "KTM Duke 390 Miniature",      price: 840,  originalPrice: 1100, rating: 4.3, image: "/images/KTM Duke 390.jpg",                     badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 32, name: "Yamaha YZF-R1 Miniature",     price: 990,  originalPrice: 1320, rating: 4.6, image: "/images/Yamaha YZF-R1.jpg",                    badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 33, name: "Ford Mustang GT Diecast",     price: 1650, originalPrice: 2150, rating: 4.6, image: "/images/Ford Mustang GT.jpeg",                 badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 34, name: "Chevrolet Camaro SS Diecast", price: 1700, originalPrice: 2200, rating: 4.5, image: "/images/Chevrolet Camaro SS.jpg",              badge: null,        category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:18", material: "Die-cast Metal", warranty: "12 months" },
  { id: 35, name: "Honda CBR1000RR-R Fireblade", price: 1080, originalPrice: 1450, rating: 4.9, image: "/images/Honda CBR1000RR-R Fireblade.jpg",      badge: "TOP RATED", category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
  { id: 36, name: "Yamaha RX 100 Miniature",     price: 750,  originalPrice: 980,  rating: 4.8, image: "/images/RX 100.jpg",                           badge: "POPULAR",   category: "Diecast",  speed: "N/A",      battery: "N/A",     range: "N/A",  scale: "1:12", material: "Die-cast Metal", warranty: "6 months"  },
]

const MAX_COMPARE = 3

const discount = (orig, price) =>
  orig ? Math.round(((orig - price) / orig) * 100) : 0

const getBestIdx = (products, key, lowerIsBetter = false) => {
  const vals = products.map(p => parseFloat(p[key]) || 0)
  const best = lowerIsBetter ? Math.min(...vals) : Math.max(...vals)
  return vals.indexOf(best)
}

// ─── Spec rows config (existing — unchanged) ──────────────────────────────────
const SPEC_ROWS = [
  { label: "Category",      key: "category", type: "text" },
  { label: "Price",         key: "price",    type: "price",  bestFn: (ps) => getBestIdx(ps, "price", true) },
  { label: "Rating",        key: "rating",   type: "rating", bestFn: (ps) => getBestIdx(ps, "rating") },
  { label: "Reviews",       key: "reviews",  type: "number", bestFn: (ps) => getBestIdx(ps, "reviews") },
  { label: "Scale",         key: "scale",    type: "text" },
  { label: "Material",      key: "material", type: "text" },
  { label: "Top Speed",     key: "speed",    type: "text" },
  { label: "Battery",       key: "battery",  type: "text" },
  { label: "Control Range", key: "range",    type: "text" },
  { label: "Warranty",      key: "warranty", type: "text" },
]

function StarRow({ rating }) {
  return (
    <span className="pc-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <FaStar key={s} className={s <= Math.round(rating) ? "pc-star-on" : "pc-star-off"} />
      ))}
      <span className="pc-rating-num">{rating}</span>
    </span>
  )
}

function SlotCard({ slot, index, onRemove, onOpen }) {
  if (!slot) {
    return (
      <div className="pc-slot pc-slot--empty" onClick={() => onOpen(index)}>
        <div className="pc-add-circle"><FaPlus /></div>
        <span className="pc-add-label">Add Product</span>
      </div>
    )
  }
  const disc = discount(slot.originalPrice, slot.price)
  return (
    <div className="pc-slot pc-slot--filled">
      <button className="pc-remove-btn" onClick={() => onRemove(index)} title="Remove">
        <FaTimes />
      </button>
      {slot.badge && <span className="pc-badge">{slot.badge}</span>}
      <div className="pc-slot-img-wrap">
        <img src={slot.image} alt={slot.name} className="pc-slot-img" />
      </div>
      <div className="pc-slot-info">
        <span className="pc-slot-category">{slot.category}</span>
        <h3 className="pc-slot-name">{slot.name}</h3>
        {slot.rating && <StarRow rating={slot.rating} />}
        {slot.reviews && <span className="pc-slot-reviews">({slot.reviews} reviews)</span>}
        <div className="pc-slot-pricing">
          <span className="pc-slot-price">₹{slot.price.toLocaleString()}</span>
          {slot.originalPrice && (
            <>
              <span className="pc-slot-orig">₹{slot.originalPrice.toLocaleString()}</span>
              <span className="pc-slot-disc">{disc}% off</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductPicker({ products, selected, onSelect, onClose }) {
  const [search, setSearch] = useState("")
  const filtered = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase())
    // dedup: id (static) or _id (DB)
    const alreadySelected = selected.some(s =>
      s && ((s.id && s.id === p.id) || (s._id && s._id === p._id))
    )
    return nameMatch && !alreadySelected
  })

  return (
    <div className="pc-picker-overlay" onClick={onClose}>
      <div className="pc-picker" onClick={e => e.stopPropagation()}>
        <div className="pc-picker-header">
          <h3>Select a Product</h3>
          <button className="pc-picker-close" onClick={onClose}><FaTimes /></button>
        </div>
        <input
          className="pc-picker-search"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        <div className="pc-picker-list">
          {filtered.map((p, i) => (
            <div className="pc-picker-item" key={p._id || p.id || i} onClick={() => onSelect(p)}>
              <img src={p.image} alt={p.name} className="pc-picker-img" />
              <div className="pc-picker-details">
                <span className="pc-picker-name">{p.name}</span>
                <span className="pc-picker-price">₹{p.price.toLocaleString()}</span>
                {p.rating && <StarRow rating={p.rating} />}
              </div>
              {p.badge && <span className="pc-picker-badge">{p.badge}</span>}
            </div>
          ))}
          {filtered.length === 0 && <p className="pc-picker-empty">No products found</p>}
        </div>
      </div>
    </div>
  )
}

export default function ProductComparison() {
  // ── Step 1: DB products fetch — Products.jsx exact same logic ──
  const [apiProducts, setApiProducts] = useState([])

  useEffect(() => {
    fetch(`${BASE}/products`)
      .then(r => r.json())
      .then(data => setApiProducts(data))
      .catch(() => {})
  }, [])

  // ── Step 2: Merge static + DB (same as Products.jsx) ──
  // Static products-ல already இருக்காதவங்களை மட்டும் DB-ல இருந்து எடுக்கோம்
  const allProducts = [
    ...staticProducts.filter(sp =>
      !apiProducts.some(
        ap => ap.name.trim().toLowerCase() === sp.name.trim().toLowerCase()
      )
    ),
    ...apiProducts.map(p => ({
      ...p,
      id:           p._id,        // picker dedup-க்கு
      desc:         p.description,
      originalPrice: p.originalPrice || Math.round(p.price * 1.3),
      rating:       p.rating   || 4.0,
      badge:        p.badge    || null,
      category:     p.category || "General",
      // ── Spec fields — AdminAddProduct save பண்றது exactly இதே names ──
      scale:    p.scale    || "N/A",
      material: p.material || "N/A",
      speed:    p.speed    || "N/A",
      battery:  p.battery  || "N/A",
      range:    p.range    || "N/A",
      warranty: p.warranty || "N/A",
    }))
  ]

  // ── Step 3: Slots — localStorage restore ──
  const [slots, setSlots] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pc-slots") || "[]")
      // Initial render-ல staticProducts மட்டும் இருக்கும், restore பண்ண try பண்ணு
      const filled = saved.map(id =>
        id ? staticProducts.find(p => String(p.id) === String(id)) || null : null
      )
      return [...filled, null, null, null].slice(0, MAX_COMPARE)
    } catch {
      return [null, null, null]
    }
  })

  // DB load ஆனதும் slots-ல DB products restore பண்று
  useEffect(() => {
    if (apiProducts.length === 0) return
    const saved = JSON.parse(localStorage.getItem("pc-slots") || "[]")
    if (!saved.length) return

    const filled = saved.map(id => {
      if (!id) return null
      // static-ல search
      const fromStatic = staticProducts.find(p => String(p.id) === String(id))
      if (fromStatic) return fromStatic
      // DB-ல search
      const fromDB = apiProducts.find(p => String(p._id) === String(id))
      if (fromDB) return allProducts.find(p => String(p._id || p.id) === String(id)) || null
      return null
    })
    setSlots([...filled, null, null, null].slice(0, MAX_COMPARE))
  }, [apiProducts])

  const [pickerOpen, setPickerOpen]   = useState(null)
  const [addedToCart, setAddedToCart] = useState({})
  const navigate  = useNavigate()
  const { addToCart } = useContext(CartContext)

  const filled = slots.filter(Boolean)

  const saveSlots = (next) => {
    localStorage.setItem(
      "pc-slots",
      JSON.stringify(next.map(s => s ? (s._id || s.id) : null))
    )
  }

  const selectProduct = (product) => {
    const next = [...slots]
    next[pickerOpen] = product
    setSlots(next)
    saveSlots(next)
    setPickerOpen(null)
  }

  const removeProduct = (idx) => {
    const next = [...slots]
    next[idx] = null
    setSlots(next)
    saveSlots(next)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    const key = product._id || product.id
    setAddedToCart(prev => ({ ...prev, [key]: true }))
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [key]: false })), 1500)
  }

  // ── Winner calculation (existing logic — unchanged) ──
  const winnerIdx = (() => {
    if (filled.length < 2) return -1
    const scores = slots.map(() => 0)
    SPEC_ROWS.forEach(row => {
      if (!row.bestFn) return
      const best = row.bestFn(filled)
      let fi = -1, count = 0
      slots.forEach((s, si) => {
        if (s) {
          if (count === best) fi = si
          count++
        }
      })
      if (fi >= 0) scores[fi]++
    })
    return scores.indexOf(Math.max(...scores))
  })()

  return (
    <div className="pc-page">

      {/* ── Header ── */}
      <div className="pc-hero">
        <FaBalanceScale className="pc-hero-icon" />
        <div>
          <h1 className="pc-hero-title">Compare Products</h1>
          <p className="pc-hero-sub">Select up to 3 products to find the best match for you</p>
        </div>
      </div>

      {/* ── Slot Cards ── */}
      <div className="pc-slots-row">
        {slots.map((slot, i) => (
          <SlotCard key={i} slot={slot} index={i} onRemove={removeProduct} onOpen={() => setPickerOpen(i)} />
        ))}
      </div>

      {/* ── Comparison Table (existing rendering — unchanged) ── */}
      {filled.length >= 2 ? (
        <div className="pc-table-wrap">
          <h2 className="pc-table-title">Detailed Comparison</h2>

          <div className="pc-table">
            {/* Sticky label column */}
            <div className="pc-col pc-col--labels">
              <div className="pc-header-cell pc-header-cell--label">Specification</div>
              {SPEC_ROWS.map(row => (
                <div className="pc-cell pc-cell--label" key={row.key}>{row.label}</div>
              ))}
              <div className="pc-cell pc-cell--label pc-cell--action">Action</div>
            </div>

            {/* Product columns */}
            {slots.map((product, si) => {
              if (!product) return null
              const isWinner    = si === winnerIdx
              const filledIndex = filled.indexOf(product)
              const cartKey     = product._id || product.id
              return (
                <div className={`pc-col ${isWinner ? "pc-col--winner" : ""}`} key={si}>
                  {isWinner && (
                    <div className="pc-winner-banner">
                      <FaTrophy className="pc-trophy" /> Best Value
                    </div>
                  )}
                  <div className={`pc-header-cell ${isWinner ? "pc-header-cell--winner" : ""}`}>
                    <img src={product.image} alt={product.name} className="pc-th-img" />
                    <span className="pc-th-name">{product.name}</span>
                  </div>

                  {SPEC_ROWS.map(row => {
                    const val        = product[row.key]
                    const bestFilled = row.bestFn ? row.bestFn(filled) : -1
                    const isBest     = row.bestFn && bestFilled === filledIndex
                    const isNA       = val === "N/A" || val === undefined || val === null

                    return (
                      <div
                        className={`pc-cell ${isBest ? "pc-cell--best" : ""} ${isNA ? "pc-cell--na" : ""}`}
                        key={row.key}
                      >
                        {row.type === "price"  && <span className="pc-val-price">₹{Number(val).toLocaleString()}</span>}
                        {row.type === "rating" && val && <StarRow rating={val} />}
                        {row.type === "number" && <span>{val ?? "—"}</span>}
                        {row.type === "text"   && <span>{isNA ? <span className="pc-na">—</span> : val}</span>}
                        {isBest && <span className="pc-best-tag">Best</span>}
                      </div>
                    )
                  })}

                  <div className="pc-cell pc-cell--action">
                    <button
                      className={`pc-cart-btn ${addedToCart[cartKey] ? "pc-cart-btn--added" : ""}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedToCart[cartKey]
                        ? <><FaCheckCircle /> Added</>
                        : <><FaShoppingCart /> Add to Cart</>}
                    </button>
                    <button
                      className="pc-buy-btn"
                      onClick={() => navigate("/checkout", { state: { product } })}
                    >
                      <FaBolt /> Buy Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="pc-empty-state">
          <FaBalanceScale className="pc-empty-icon" />
          <p>Add at least 2 products to start comparing</p>
        </div>
      )}

      {/* ── Picker Modal ── */}
      {pickerOpen !== null && (
        <ProductPicker
          products={allProducts}
          selected={slots}
          onSelect={selectProduct}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </div>
  )
}