import { useState, useEffect, useContext } from "react"
import { FaSearch, FaHeart, FaRegHeart, FaStar, FaFilter, FaTimes, FaShoppingCart, FaBolt, FaBalanceScale } from "react-icons/fa"
import { MdLocalOffer, MdVerified } from "react-icons/md"
import "./Products.css"
import { useNavigate, Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"
import axios from "axios"

function Products() {
  const [search, setSearch] = useState("")
  const [apiProducts, setApiProducts] = useState([])
  const [sortBy, setSortBy] = useState("default")
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState(null) // null = All
  const [selectedRating, setSelectedRating] = useState(0)
  const [addedToCart, setAddedToCart] = useState({})
  const [reviewCounts, setReviewCounts] = useState({}) // ✅ live review counts

  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { wishlist, toggleWishlist, isInWishlist } = useContext(WishlistContext)

  const staticProducts = [
    { id: 1, name: "RC Lamborghini Aventador", price: 2500, originalPrice: 3500, rating: 4.2, desc: "High performance remote control supercar with turbo boost.", image: "/images/RC Lamborghini Aventador blackp1.jpg", badge: "BESTSELLER", category: "RC Cars" },
    { id: 2, name: "BMW M4 Diecast Model", price: 1200, originalPrice: 1800, rating: 4.8, desc: "Premium diecast collectible model, 1:18 scale.", image: "/images/BMW M4 Diecast Modelp2.jpg", badge: "TOP RATED", category: "Diecast" },
    { id: 3, name: "Nissan GT‑R R35", price: 1200, rating: 5, desc: "Premium diecast collectible model.", image: "/images/Nissan GT‑R R35p3.jpg", category: "RC Cars" },
    { id: 4, name: "Miniature Ducati Bike", price: 900, rating: 4, desc: "Detailed scale model of Ducati superbike.", image: "/images/Miniature Ducati Bikep4.jpg", category: "Diecast" },
    { id: 5, name: "RC Monster Truck", price: 3000, rating: 5, desc: "Powerful off-road remote control monster truck.", image: "/images/RC Monster Truckp5.jpg", category: "RC Cars" },
    { id: 6, name: "Ferrari 488 GTB Diecast", price: 1500, rating: 4, desc: "Luxury Ferrari scale model for collectors.", image: "/images/Ferrari 488 GTB Diecastp6.jpg", category: "Diecast" },
    { id: 7, name: "RC Drift Racing Car", price: 2200, rating: 4, desc: "High speed RC drift car with smooth handling.", image: "/images/RC Drift Racing Carp7.jpg", category: "RC Cars" },
    { id: 8, name: "Miniature Yamaha R1", price: 950, rating: 4, desc: "Premium Yamaha R1 miniature bike model.", image: "/images/Miniature Yamaha R1p8.jpg", category: "Diecast" },
    { id: 9, name: "RC Buggy Off Road", price: 2800, rating: 5, desc: "Durable off-road buggy with strong suspension.", image: "/images/RC Buggy Off Roadp9.jpg", category: "RC Cars" },
    { id: 10, name: "Porsche 911 Diecast", price: 1700, rating: 4, desc: "Classic Porsche collectible miniature model.", image: "/images/Porsche 911 Diecastp10.jpg", category: "Diecast" },
    { id: 11, name: "Nissan GT-R R35 RC Car", price: 2600, rating: 5, desc: "High performance RC sports car with aggressive design.", image: "/images/Nissan GT-R R35 RC Carp11.jpg", category: "RC Cars" },
    { id: 12, name: "Audi R8 V10 Diecast", price: 1800, rating: 4, desc: "Premium diecast model of the iconic Audi R8 supercar.", image: "/images/Audi R8 V10 Diecastp12.jpg", category: "RC Cars" },
    { id: 13, name: "Pulsar Bike", price: 850, originalPrice: 1100, desc: "Detailed Bajaj Pulsar scale model for bike lovers.", image: "/images/pulsar bike.jpg", badge: null, category: "Diecast" },
    { id: 14, name: "Mahindra Thar RC Car", price: 2700, originalPrice: 3500, rating: 4.6, desc: "Rugged 4x4 remote control Thar with off-road capability.", image: "/images/thar.jpg", badge: "NEW", category: "RC Cars" },
    { id: 15, name: "Kawasaki Ninja", price: 980, originalPrice: 1300, rating: 4.5, desc: "Premium Kawasaki Ninja scale model with sport finish.", image: "/images/kawasaki bike.jpg", badge: null, category: "Diecast" },
    { id: 16, name: "Royal Enfield Bullet", price: 920, originalPrice: 1200, rating: 4.7, desc: "Classic Royal Enfield Bullet collectible miniature model.", image: "/images/royal enfield.jpg", badge: "POPULAR", category: "Diecast" },
    // ── Trucks & Off-Road ──
    { id: 17, name: "RAM 1500 TRX RC Car", price: 3200, originalPrice: 4200, rating: 4.7, desc: "High-performance RC pickup truck with monster suspension.", image: "/images/RAM 1500 TRX.jpg", badge: "NEW", category: "RC Cars" },
    { id: 18, name: "CAT 797F Dump Truck Diecast", price: 2200, originalPrice: 2900, rating: 4.5, desc: "Iconic CAT mining dump truck premium diecast model.", image: "/images/CAT 797F Dump Truck.jpg", badge: null, category: "Diecast" },
    { id: 19, name: "Ford F-150 Raptor RC Car", price: 3000, originalPrice: 3900, rating: 4.8, desc: "Powerful off-road RC Ford Raptor with 4WD drive system.", image: "/images/Ford F-150 Raptor.jpg", badge: "BESTSELLER", category: "RC Cars" },
    { id: 20, name: "Ferrari LaFerrari Diecast", price: 2500, originalPrice: 3200, rating: 4.9, desc: "Luxury Ferrari LaFerrari hybrid supercar diecast collectible.", image: "/images/Ferrari LaFerrari.jpg", badge: "TOP RATED", category: "Diecast" },
    { id: 21, name: "Tesla Model S Plaid Diecast", price: 1900, originalPrice: 2500, rating: 4.6, desc: "Premium Tesla Model S Plaid electric car scale model.", image: "/images/Tesla Model S Plaid.jpg", badge: null, category: "Diecast" },

    // ── Heavy Trucks ──
    { id: 22, name: "Tata Prima Truck Diecast", price: 1600, originalPrice: 2100, rating: 4.3, desc: "Detailed Tata Prima heavy truck diecast collectible.", image: "/images/Tata Prima.jpg", badge: null, category: "Diecast" },
    { id: 23, name: "MAN TGX Truck Diecast", price: 1750, originalPrice: 2300, rating: 4.4, desc: "European MAN TGX long-haul truck premium scale model.", image: "/images/MAN TGX.jpg", badge: null, category: "Diecast" },
    { id: 24, name: "Scania R730 Truck Diecast", price: 1850, originalPrice: 2400, rating: 4.6, desc: "Iconic Scania R730 V8 truck collector's diecast model.", image: "/images/Scania R730.jpg", badge: "POPULAR", category: "Diecast" },
    { id: 25, name: "Jeep Wrangler Rubicon RC Car", price: 2900, originalPrice: 3800, rating: 4.7, desc: "Rugged RC Jeep Wrangler with rock-crawling capability.", image: "/images/Jeep Wrangler Rubicon.jpg", badge: null, category: "RC Cars" },
    { id: 26, name: "Volvo FH16 Truck Diecast", price: 1950, originalPrice: 2550, rating: 4.5, desc: "Premium Volvo FH16 750hp truck diecast scale model.", image: "/images/Volvo FH16.jpg", badge: null, category: "Diecast" },

    // ── Bikes ──
    { id: 27, name: "TVS Apache RR 310 Miniature", price: 880, originalPrice: 1150, rating: 4.4, desc: "Detailed TVS Apache RR 310 race bike miniature model.", image: "/images/TVS Apache RR 310.jpg", badge: null, category: "Diecast" },
    { id: 28, name: "BMW S1000RR Miniature", price: 1050, originalPrice: 1400, rating: 4.8, desc: "Premium BMW S1000RR superbike precision scale model.", image: "/images/BMW M4 Diecast Modelp2.jpg", badge: "TOP RATED", category: "Diecast" },
    { id: 29, name: "Suzuki Hayabusa Miniature", price: 1000, originalPrice: 1350, rating: 4.7, desc: "Iconic Suzuki Hayabusa GSX1300R collector's miniature.", image: "/images/Suzuki Hayabusa.jpg", badge: "POPULAR", category: "Diecast" },
    { id: 30, name: "Honda CBR1000RR Miniature", price: 970, originalPrice: 1280, rating: 4.5, desc: "Precision Honda CBR1000RR Fireblade scale model.", image: "/images/Honda CBR1000RR.jpg", badge: null, category: "Diecast" },
    { id: 31, name: "KTM Duke 390 Miniature", price: 840, originalPrice: 1100, rating: 4.3, desc: "Sporty KTM Duke 390 detailed miniature bike model.", image: "/images/KTM Duke 390.jpg", badge: null, category: "Diecast" },
    { id: 32, name: "Yamaha YZF-R1 Miniature", price: 990, originalPrice: 1320, rating: 4.6, desc: "High-detail Yamaha YZF-R1 MotoGP replica scale model.", image: "/images/Yamaha YZF-R1.jpg", badge: null, category: "Diecast" },

    // ── Muscle Cars ──
    { id: 33, name: "Ford Mustang GT Diecast", price: 1650, originalPrice: 2150, rating: 4.6, desc: "Classic Ford Mustang GT500 premium diecast collectible.", image: "/images/Ford Mustang GT.jpeg", badge: null, category: "Diecast" },
    { id: 34, name: "Chevrolet Camaro SS Diecast", price: 1700, originalPrice: 2200, rating: 4.5, desc: "Iconic Chevrolet Camaro SS muscle car diecast model.", image: "/images/Chevrolet Camaro SS.jpg", badge: null, category: "Diecast" },
    { id: 35, name: "Honda CBR1000RR-R Fireblade", price: 1080, originalPrice: 1450, rating: 4.9, desc: "Precision Honda CBR1000RR-R SP superbike collector's miniature.", image: "/images/Honda CBR1000RR-R Fireblade.jpg", badge: "TOP RATED", category: "Diecast" },
    { id: 36, name: "Yamaha RX 100 Miniature", price: 750, originalPrice: 980, rating: 4.8, desc: "Iconic vintage Yamaha RX 100 classic bike miniature model.", image: "/images/RX 100.jpg", badge: "POPULAR", category: "Diecast" },
  ]

  // ✅ Fetch API products
  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => setApiProducts(res.data))
      .catch(err => console.log(err))
  }, [])

  // ✅ Fetch review counts — single API call for all products
  const fetchReviewCounts = () => {
    axios.get("http://localhost:5000/review-counts")
      .then(res => {
        const countsMap = {}
        res.data.forEach(item => {
          countsMap[String(item._id)] = {
            count: item.count,
            avgRating: parseFloat(item.avgRating.toFixed(1))
          }
        })
        setReviewCounts(countsMap)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchReviewCounts()
  }, [])

  const allProducts = [
    ...staticProducts.filter(sp =>
      !apiProducts.some(
        ap => ap.name.trim().toLowerCase() === sp.name.trim().toLowerCase()
      )
    ),
    ...apiProducts.map(p => ({
      ...p,
      id: p._id,
      desc: p.description,
      originalPrice: p.originalPrice || Math.round(p.price * 1.3),
      rating: p.rating || 4.0,
      badge: p.badge || null,
      category: p.category || "General",
      stock: p.stock ?? 0

    }))
  ]

  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedToCart(prev => ({ ...prev, [product.id || product._id]: true }))
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id || product._id]: false }))
    }, 1500)
  }

  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } })
  }

  const discount = (orig, price) => Math.round(((orig - price) / orig) * 100)

  const filtered = allProducts
    .filter(p =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (!priceRange || (p.price >= priceRange.min && p.price <= priceRange.max)) &&
      (selectedRating === 0 || p.rating >= selectedRating)
    )
    .sort((a, b) => {
      if (sortBy === "low") return a.price - b.price
      if (sortBy === "high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "discount") return discount(b.originalPrice, b.price) - discount(a.originalPrice, a.price)
      return 0
    })

  return (
    <div className="fp-page">

      {/* Top Search Bar */}
      <div className="fp-searchbar">
        <FaSearch className="fp-search-icon" />
        <input
          type="text"
          placeholder="Search for products, brands and more"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <FaTimes className="fp-clear-icon" onClick={() => setSearch("")} />
        )}
      </div>

      <div className="fp-layout">

        {/* Sidebar Filters */}
        <aside className={`fp-sidebar ${filterOpen ? "fp-sidebar-open" : ""}`}>
          <div className="fp-sidebar-header">
            <h3>Filters</h3>
            <button className="fp-close-filter" onClick={() => setFilterOpen(false)}><FaTimes /></button>
          </div>

          <div className="fp-filter-section">
            <h4>Price Range</h4>
            {[
              { label: "₹300 – ₹400", min: 300, max: 400 },

              { label: "₹700 – ₹1000", min: 700, max: 1000 },
              { label: "₹1000 – ₹1500", min: 1000, max: 1500 },
              { label: "Above ₹1500", min: 1500, max: Infinity },
            ].map(range => (
              <label key={range.label} className="fp-rating-label">
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange?.min === range.min && priceRange?.max === range.max}
                  onChange={() => setPriceRange(range)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>


          <div className="fp-filter-section">
            <h4>Customer Rating</h4>
            {[4, 3, 2, 1].map(r => (
              <label key={r} className="fp-rating-label">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === r}
                  onChange={() => setSelectedRating(selectedRating === r ? 0 : r)}
                />
                <span className="fp-rating-stars">
                  {[1, 2, 3, 4, 5].map(s => (
                    <FaStar key={s} style={{ color: s <= r ? "#ff9f00" : "#ddd", fontSize: "13px" }} />
                  ))}
                </span>
                <span>& above</span>
              </label>
            ))}
          </div>

          <button className="fp-clear-btn" onClick={() => { setPriceRange(null); setSelectedRating(0) }}>
            Clear All
          </button>
        </aside>

        {/* Main Content */}
        <main className="fp-main">

          {/* Sort Bar */}
          <div className="fp-sortbar">
            <span className="fp-result-count">{filtered.length} Products</span>
            <div className="fp-sort-options">
              <span>Sort by:</span>
              {[
                { val: "default", label: "Relevance" },
                { val: "low", label: "Price: Low to High" },
                { val: "high", label: "Price: High to Low" },
                { val: "rating", label: "Top Rated" },
                { val: "discount", label: "Best Discount" }
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`fp-sort-btn ${sortBy === opt.val ? "fp-sort-active" : ""}`}
                  onClick={() => setSortBy(opt.val)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="fp-filter-toggle" onClick={() => setFilterOpen(true)}>
              <FaFilter /> Filters
            </button>
            <Link to="/compare" className="fp-compare-toggle">
              <FaBalanceScale /> Compare
            </Link>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="fp-empty">
              <p>No products found. Try different filters!</p>
            </div>
          ) : (
            <div className="fp-grid">
              {filtered.map(product => {
                const pid = product.id || product._id
                const disc = discount(product.originalPrice || product.price * 1.3, product.price)
                const inWishlist = isInWishlist(pid)
                const justAdded = addedToCart[pid]

                // ✅ Live review data from MongoDB
                const liveData = reviewCounts[String(pid)]
                const displayRating = liveData ? liveData.avgRating : product.rating
                const displayReviews = liveData ? liveData.count : product.reviews
                const hasLiveReviews = !!liveData

                return (
                  <div className="fp-card" key={pid}>

                    {product.badge && (
                      <div className="fp-badge">{product.badge}</div>
                    )}

                    <button
                      className="fp-wishlist-btn"
                      onClick={() => toggleWishlist(product)}
                      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {inWishlist ? <FaHeart style={{ color: "#f00" }} /> : <FaRegHeart />}
                    </button>

                    <Link to={`/product/${pid}`} className="fp-img-link">
                      <div className="fp-img-wrapper">
                        <img src={product.image} alt={product.name} />
                      </div>
                    </Link>

                    <div className="fp-card-info">
                      <Link to={`/product/${pid}`} className="fp-product-name">
                        <h3>{product.name}</h3>
                      </Link>

                      {/* ✅ Live rating + review count */}
                      <div className="fp-rating-row">
                        <span className="fp-rating-pill">
                          {displayRating} <FaStar style={{ fontSize: "10px" }} />
                        </span>
                        <span className="fp-reviews">
                          ({displayReviews} reviews)
                          {hasLiveReviews && <span className="fp-live-dot" title="Live data" />}
                        </span>
                        {displayRating >= 4.5 && (
                          <span className="fp-verified"><MdVerified /> Verified</span>
                        )}
                      </div>

                      <div className="fp-price-row">
                        <span className="fp-price">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="fp-original">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="fp-discount">{disc}% off</span>
                          </>
                        )}
                      </div>

                      <div className="fp-offer-tag">
                        <MdLocalOffer /> Free delivery on this item
                      </div>

                      {/* Stock badge */}
                      {(() => {
                        const pid = product.id || product._id
                        const isDbProduct = !!product._id
                        if (!isDbProduct) return null   // static products ku காட்டல

                        const stock = product.stock ?? 0
                        if (stock === 0) return (
                          <div className="fp-stock-badge out">❌ Out of Stock</div>
                        )
                        if (stock <= 5) return (
                          <div className="fp-stock-badge low">⚠️ Only {stock} left!</div>
                        )
                        if (stock <= 15) return (
                          <div className="fp-stock-badge med">🟡 Limited Stock</div>
                        )
                        return null   // in stock — badge வேண்டாம்
                      })()}

                      <div className="fp-card-btns">
                        <button
                          className={`fp-cart-btn ${justAdded ? "fp-added" : ""} ${product._id && (product.stock ?? 0) === 0 ? "fp-disabled" : ""
                            }`}
                          onClick={() => {
                            if (product._id && (product.stock ?? 0) === 0) return
                            handleAddToCart(product)
                          }}
                        >
                          <FaShoppingCart />
                          {product._id && (product.stock ?? 0) === 0
                            ? "Out of Stock"
                            : justAdded ? "Added!" : "Add to Cart"}
                        </button>


                        <button
                          className={`fp-buy-btn ${product._id && (product.stock ?? 0) === 0 ? "fp-disabled" : ""
                            }`}
                          onClick={() => {
                            if (product._id && (product.stock ?? 0) === 0) return
                            handleBuyNow(product)
                          }}
                        >
                          <FaBolt />
                          {product._id && (product.stock ?? 0) === 0 ? "Unavailable" : "Buy Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Products