import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import "./ProductCard.css"

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext)
  const { user } = useAuth()
  const navigate = useNavigate()

  const requireAuth = (action) => {
    if (!user) {
      navigate("/login")
      return
    }
    action()
  }

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product)
      navigate("/cart")
    })
  }

  const handleBuyNow = () => {
    requireAuth(() => {
      navigate("/checkout", { state: { product } })
    })
  }

  return (
    <div className="product-card" data-aos="fade-up">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
      <button className="btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
      <button className="btn buy-btn" onClick={handleBuyNow}>
        Buy Now
      </button>
    </div>
  )
}

export default ProductCard