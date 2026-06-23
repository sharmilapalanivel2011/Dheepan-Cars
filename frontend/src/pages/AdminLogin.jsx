import { API_URL } from "../config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./AdminLogin.css"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { adminLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError("")

  try {
    const res = await fetch(`${API_URL}/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.success) {
      adminLogin({ email, role: "admin" })
      navigate("/admin")
    } else {
      setError(data.message || "Invalid credentials")
    }
  } catch (err) {
    setError("Server error. Try again.")
  }

  setLoading(false)
}

 return (
  <div className="admin-login-page">
    <div className="admin-login-box">
      <h2>🔐 Admin Login</h2>
      <p className="subtitle">Dheepan Cars — Admin Panel</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>

      <p className="admin-switch">
        Not admin?{" "}
        <span onClick={() => navigate("/")}>Go to User Login</span>
      </p>
    </div>
  </div>
)
}

export default AdminLogin