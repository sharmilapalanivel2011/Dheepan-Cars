import { API_URL } from "../config"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import "./Login.css"
import { useNavigate, useLocation } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"

function Login() {
  const [step, setStep] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)   // ← NEW

  const { login, adminLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectAfterLogin = (userData) => {
    if (userData.role === "admin") {
      adminLogin(userData)
      navigate("/admin")
    } else {
      login(userData)
      const from = location.state?.from?.pathname || "/"
      navigate(from, { replace: true })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password
      })

      if (res.data.success) {
        redirectAfterLogin(res.data.user)
      } else if (res.data.requireOtp) {
        await axios.post(`${API_URL}/send-otp`, { email })
        setStep("otp")
      } else {
        alert(res.data.message)
      }
    } catch (err) {
       alert("Login failed: " + err.message + " | " + JSON.stringify(err.response?.data || "no response"))
}
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp
      })
      if (res.data.success) {
        redirectAfterLogin(res.data.user)
      } else {
        alert("Wrong OTP")
      }
    } catch (err) {
      alert("OTP verification failed.")
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Dheepan Cars</h2>

        
        {/* LOGIN FORM */}
        {step === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder={isAdmin ? "Admin Email" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">
              {isAdmin ? "Admin Login" : "Login"}
            </button>

            {/* User மட்டும் காட்டுவோம் */}
            {!isAdmin && (
              <>
                <p onClick={() => navigate("/register")}>
                  New user? Register
                </p>
                <div className="login-links-row">
  <p className="forgot" onClick={() => navigate("/reset-password")}>
    Forgot Password?
  </p>
  <span className="link-separator">|</span>
  <p className="admin-link" onClick={() => navigate("/admin-login")}>
   🔐Go to Admin Login
  </p>
</div>
                


              </>
            )}
          </form>
        )}

        {/* OTP FORM */}
        {step === "otp" && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="login-btn" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Login