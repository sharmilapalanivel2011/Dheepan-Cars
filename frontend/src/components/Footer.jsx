import "./Footer.css"
import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-col">
          <h2 className="footer-logo">
            <Link to="/" className="footer-link logo-link">
              Dheepan Cars
            </Link>
          </h2>

          <p>
            Dheepan Cars is a premium online store dedicated to miniature and remote control vehicles.
            We bring high-quality scale models designed for collectors, hobbyists, and automotive enthusiasts.
          </p>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h3>Categories</h3>

          <ul>
            <li>
              <Link to="/products" className="footer-link">
                RC Cars
              </Link>
            </li>

            <li>
              <Link to="/products" className="footer-link">
                Diecast Models
              </Link>
            </li>

            <li>
              <Link to="/products" className="footer-link">
                Miniature Bikes
              </Link>
            </li>

            <li>
              <Link to="/products" className="footer-link">
                Trucks & Heavy Vehicles
              </Link>
            </li>

            <li>
              <Link to="/products" className="footer-link">
                Limited Edition Models
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-col">
          <h3>Customer Service</h3>

          <ul>
            <li>
              <Link to="/profile" className="footer-link">
                My Account
              </Link>
            </li>

            <li>
              <Link to="/my-orders" className="footer-link">
                Order Tracking
              </Link>
            </li>

            <li>
              <Link to="/wishlist" className="footer-link">
                Wishlist
              </Link>
            </li>

            <li>
              <Link to="/customer-support" className="footer-link">
                No Returns
              </Link>
            </li>

            <li>
              <Link to="/customer-support" className="footer-link">
                Customer Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact Us</h3>

          <p>📍 Thiruvarur, Tamil Nadu, India</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 dheepancarsproject@gmail.com</p>

          
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Dheepan Cars | All Rights Reserved</p>
      </div>
    </footer>
  )
}

export default Footer