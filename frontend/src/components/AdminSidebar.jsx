import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import "../styles/Admin.css"

function AdminSidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { to: "/admin", icon: "🏠", label: "Dashboard" },
    { to: "/admin/orders", icon: "📦", label: "Orders" },
    { to: "/admin/products", icon: "🚗", label: "Products" },
    { to: "/admin/stock", icon: "📊", label: "Stock" },
    { to: "/admin/analytics", icon: "📈", label: "Analytics" },
    { to: "/admin/add-product", icon: "➕", label: "Add Product" },
  ]

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <h2>Dheepan Admin</h2>

        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "sidebar-active" : ""}
            onClick={() => setIsOpen(false)}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}

export default AdminSidebar