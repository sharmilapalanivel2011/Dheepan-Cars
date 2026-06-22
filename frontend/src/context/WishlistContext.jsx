import { createContext, useState, useContext, useEffect } from "react"

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {

  // localStorage இல் இருந்து initial data எடுக்குது
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem("wishlistItems")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // wishlistItems மாறும்போது localStorage update ஆகும்
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Just the IDs array — derived from wishlistItems
  const wishlist = wishlistItems.map(item => item.id || item._id)

  const toggleWishlist = (product) => {
    const pid = product.id || product._id
    setWishlistItems(prev => {
      const exists = prev.find(i => (i.id || i._id) === pid)
      if (exists) {
        return prev.filter(i => (i.id || i._id) !== pid)
      } else {
        return [...prev, product]
      }
    })
  }

  const removeFromWishlist = (pid) => {
    setWishlistItems(prev => prev.filter(i => (i.id || i._id) !== pid))
  }

  const isInWishlist = (pid) => wishlist.includes(pid)

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)