import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Register.css"
import { useAuth } from "../context/AuthContext"

function Register(){

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState("register")
  const { login } = useAuth()

  const navigate = useNavigate()

 const handleRegister = async () => {

  console.log("Clicked", email)

  try {
    const res = await axios.post("http://localhost:5000/register", {
      username,
      email,
      password
    })

    console.log("Response:", res.data)

    if(res.data.success){
      setStep("otp")
    } else {
      alert(res.data.message)
    }

  } catch (err) {
    console.log("ERROR:", err)
  }
}




  const handleVerifyOtp = async () => {

    const res = await axios.post("http://localhost:5000/verify-otp", {
      email,
      otp
    })

    if(res.data.success){
      login(res.data.user)
      navigate("/")
    } else {
      alert("Wrong OTP")
    }
  }

  return(
  <div className="register-container">
    <div className="register-box">

      <h2>Register</h2>

      {step === "register" && (
        <>
          <input placeholder="Username" onChange={(e)=>setUsername(e.target.value)} />
          <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>

          <p className="login-link" onClick={()=>navigate("/")}>
            Already have an account? Login
          </p>
        </>
      )}

      {step === "otp" && (
        <div className="otp-box">
          <input placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)} />
          <button className="register-btn" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>
      )}

    </div>
  </div>
)
}

export default Register