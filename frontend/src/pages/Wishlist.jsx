import { API_URL } from "../config"
import { useContext } from "react"
import { WishlistContext } from "../context/WishlistContext"
import { CartContext } from "../context/CartContext"
import { useNavigate, Link } from "react-router-dom"
import { FaHeart, FaTrash, FaShoppingCart, FaBolt, FaStar, FaArrowLeft } from "react-icons/fa"
import { MdLocalOffer } from "react-icons/md"
import "./Wishlist.css"

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext)
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } })
  }

  const discount = (orig, price) =>
    orig && orig > price ? Math.round(((orig - price) / orig) * 100) : null

  return (
    <div className="wl-page">

      {/* Ambient background blobs */}
      <div className="wl-bg-blob wl-blob1" />
      <div className="wl-bg-blob wl-blob2" />

      {/* Header */}
      <div className="wl-header">
        <button className="wl-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="wl-title-group">
          <FaHeart className="wl-title-icon" />
          <h1 className="wl-title">My Wishlist</h1>
          <span className="wl-count-chip">{wishlistItems.length} items</span>
        </div>
      </div>

      {/* Divider */}
      <div className="wl-divider" />

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="wl-empty">
          <div className="wl-empty-icon-wrap">
            <FaHeart className="wl-empty-icon" />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love by clicking the heart icon on any product.</p>
          <Link to="/products" className="wl-browse-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="wl-grid">
            {wishlistItems.map((product) => {
              const pid = product.id || product._id
              const disc = discount(product.originalPrice, product.price)

              return (
                <div className="wl-card" key={pid}>

                  {/* Remove button */}
                  <button
                    className="wl-remove-btn"
                    onClick={() => removeFromWishlist(pid)}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>

                  {/* Discount Badge */}
                  {disc && <div className="wl-disc-badge">{disc}% OFF</div>}

                  {/* Image */}
                  <Link to={`/product/${pid}`} className="wl-img-link">
                    <div className="wl-img-wrapper">
                      <img src={product.image} alt={product.name} />
                      <div className="wl-img-overlay" />
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="wl-card-body">
                    <Link to={`/product/${pid}`} className="wl-name-link">
                      <h3 className="wl-product-name">{product.name}</h3>
                    </Link>

                    <p className="wl-desc">{product.desc}</p>

                    {/* Rating */}
                    <div className="wl-rating-row">
                      <span className="wl-rating-pill">
                        {product.rating}
                        <FaStar className="wl-star-icon" />
                      </span>
                      {product.reviews && (
                        <span className="wl-reviews">({product.reviews} reviews)</span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="wl-price-row">
                      <span className="wl-price">₹{product.price?.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="wl-original">₹{product.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Offer */}
                    <div className="wl-offer">
                      <MdLocalOffer className="wl-offer-icon" />
                      Free delivery on this item
                    </div>

                    {/* Action Buttons */}
                    <div className="wl-btn-group">
                      <button
                        className="wl-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                      <button
                        className="wl-buy-btn"
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

          {/* Footer CTA */}
          <div className="wl-footer-cta">
            <Link to="/products" className="wl-continue-btn">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Wishlist