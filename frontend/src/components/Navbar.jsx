import { NavLink } from "react-router-dom"
import { useState, useContext } from "react"
import { FaBars, FaHeart } from "react-icons/fa"
import "./Navbar.css"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { WishlistContext } from "../context/WishlistContext"

function Navbar() {

  const navigate = useNavigate()
  const { wishlist } = useContext(WishlistContext)

  const handleLogout = () => {
    localStorage.removeItem("user")
    alert("Logged out")
    navigate("/login")
  }

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">

      <div className="logo">
        Dheepan Cars
      </div>

      {/* Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>

      <div className={menuOpen ? "nav-links active" : "nav-links"}>

        <NavLink to="/" end onClick={closeMenu}>Home</NavLink>

        <NavLink to="/products" onClick={closeMenu}>Products</NavLink>

        <NavLink to="/cart" onClick={closeMenu}>Cart</NavLink>

        <NavLink to="/my-orders" onClick={closeMenu}>My Orders</NavLink>
        <NavLink to="/wishlist" onClick={closeMenu}>
           Wishlist
        </NavLink>

        <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>

        

      </div>

    </nav>
  )
}

export default Navbar