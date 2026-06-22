// src/context/CartContext.jsx
import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

const CART_KEY = "dheepan_cart"

function CartProvider({ children }) {
  // Initialize from localStorage on first load
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const id = product.id || product._id
      const exists = prev.find(item => (item.id || item._id) === id)
      if (exists) {
        return prev.map(item =>
          (item.id || item._id) === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        (item.id || item._id) === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          (item.id || item._id) === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => (item.id || item._id) !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQty, decreaseQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartProvider }   