import { Routes, Route, useLocation } from "react-router-dom";
import AOS from 'aos'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import UserProfile from "./pages/UserProfile";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import CustomerSupport from "./pages/CustomerSupport"
import ProductComparison from "./components/ProductComparison"
import AdminStock from "./pages/AdminStock"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminAddProduct from "./pages/AdminAddProduct"



function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||

    location.pathname === "/register" ||
    location.pathname === "/admin-login" ||
    
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Routes - login not needed */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />

        <Route path="/compare" element={<ProductComparison />} />

        {/* Protected Routes - login required */}
        <Route path="/customer-support" element={<ProtectedRoute><CustomerSupport /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
        <Route path="/admin/order-tracking/:orderId" element={<AdminRoute><OrderTracking /></AdminRoute>} />
        <Route path="/admin/stock" element={<AdminRoute><AdminStock /></AdminRoute>} />
<Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
<Route path="/admin/add-product" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;