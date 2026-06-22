import "./FeaturedProducts.css"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from "react-icons/fa"
import { MdLocalOffer, MdVerified } from "react-icons/md"

const products = [
  {
    id: 1,
    name: "RC Lamborghini Aventador",
    price: 2500,
    originalPrice: 3500,
    rating: 4.2,
    reviews: 128,
    desc: "High performance remote control supercar with turbo boost.",
    image: "/images/RC Lamborghini Aventador.jpg",
    badge: "BESTSELLER",
  },
  
  {
    id: 2,
    name: "Miniature Ducati Bike",
    price: 900,
    originalPrice: 1300,
    rating: 4.0,
    reviews: 87,
    desc: "Detailed scale model of Ducati superbike.",
    image: "/images/Miniature Ducati Bike.jpg",
    badge: null,
  },
  {
    id: 3,
    name: "BMW M4 Diecast Model",
    price: 1200,
    originalPrice: 1800,
    rating: 4.8,
    reviews: 245,
    desc: "Premium diecast collectible model, 1:18 scale.",
    image: "/images/BMW M4 Diecast Model.jpg",
    badge: "TOP RATED",
  },
]

const discount = (orig, price) => Math.round(((orig - price) / orig) * 100)

function FeaturedProducts() {
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()

  const [wishlist, setWishlist] = useState([])
  const [addedToCart, setAddedToCart] = useState({})

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    )
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedToCart(prev => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }))
    }, 1500)
  }

  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } })
  }

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map(star => (
      <FaStar
        key={star}
        style={{ color: star <= Math.round(rating) ? "#ff9f00" : "#2e2e2e", fontSize: "11px" }}
      />
    ))

  return (
    <section className="fp-featured" data-aos="fade-up">

      <div className="fp-feat-header">
        <h2 className="fp-feat-title">Featured Vehicles</h2>
        <button className="fp-feat-viewall" onClick={() => navigate("/products")}>
          View All →
        </button>
      </div>

      <div className="fp-feat-grid">
        {products.map(product => {
          const disc = discount(product.originalPrice, product.price)
          const inWishlist = wishlist.includes(product.id)
          const justAdded = addedToCart[product.id]

          return (
            <div className="fp-feat-card" key={product.id}>

              {product.badge && (
                <div className="fp-feat-badge">{product.badge}</div>
              )}

              <button
                className="fp-feat-wishlist"
                onClick={() => toggleWishlist(product.id)}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist
                  ? <FaHeart style={{ color: "#e50914" }} />
                  : <FaRegHeart style={{ color: "#555" }} />
                }
              </button>

              <div
                className="fp-feat-img-wrap"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.image} alt={product.name} 
                style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              </div>

              <div className="fp-feat-info">

                <h3
                  className="fp-feat-name"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>

                <div className="fp-feat-rating-row">
                  <span className="fp-feat-rating-pill">
                    {product.rating} <FaStar style={{ fontSize: "10px" }} />
                  </span>
                  <span className="fp-feat-reviews">({product.reviews} reviews)</span>
                  {product.rating >= 4.5 && (
                    <span className="fp-feat-verified">
                      <MdVerified /> Verified
                    </span>
                  )}
                </div>

                <div className="fp-feat-price-row">
                  <span className="fp-feat-price">₹{product.price.toLocaleString()}</span>
                  <span className="fp-feat-original">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="fp-feat-disc">{disc}% off</span>
                </div>

                <div className="fp-feat-offer">
                  <MdLocalOffer /> Free delivery on this item
                </div>

                <div className="fp-feat-btns">
                  <button
                    className={`fp-feat-cart ${justAdded ? "fp-feat-added" : ""}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart />
                    {justAdded ? "Added!" : "Add to Cart"}
                  </button>
                  <button
                    className="fp-feat-buy"
                    onClick={() => handleBuyNow(product)}
                  >
                    <FaBolt />
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}

export default FeaturedProducts