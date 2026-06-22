import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.css"
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter } from "react-router-dom"   // ✅ ADD THIS
import { WishlistProvider } from "./context/WishlistContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ WRAP HERE */}
      <GoogleOAuthProvider clientId="994440570924-qfkq59gmr1b17g4p5lojrvo2l6qbqs0m.apps.googleusercontent.com">
        <AuthProvider>
          <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)