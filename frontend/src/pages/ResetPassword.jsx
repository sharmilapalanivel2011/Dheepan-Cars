import { API_URL } from "../config"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


function ResetPassword(){


  const [step, setStep] = useState("email")
  // email → otp → newPassword


  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")


  const navigate = useNavigate()


  // STEP 1: SEND OTP
  const handleSendOtp = async () => {
    const res = await axios.post(`${API_URL}/send-otp`, {
      email
    })


    if(res.data.success){
      setStep("otp")
    }
  }


  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async () => {
    const res = await axios.post(`${API_URL}/verify-otp`, {
      email,
      otp
    })


    if(res.data.success){
      setStep("newPassword")
    } else {
      alert("Wrong OTP")
    }
  }


  // STEP 3: RESET PASSWORD
  const handleResetPassword = async () => {
    const res = await axios.post(`${API_URL}/reset-password`, {
      email,
      password
    })


    if(res.data.success){
      alert("Password Updated ✅")
      navigate("/") // go back to login
    }
  }


  return(
    <div className="login-container">
      <div className="login-box">


        <h2>Reset Password</h2>


        {/* STEP 1 */}
        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
           <button
  onClick={handleSendOtp}
  style={{
    width: "50%",
    padding: "10px",
    background: "#ff2e4d",
    border: "none",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s"
  }}
>
  Send OTP
</button>
          </>
        )}


        {/* STEP 2 */}
        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
            />
            <button
  onClick={handleVerifyOtp}
  onMouseOver={(e)=> e.target.style.background = "#c4002b"}
  onMouseOut={(e)=> e.target.style.background = "#ff2e4d"}
  style={{
    width: "100%",
    padding: "10px",
    background: "#ff2e4d",
    border: "none",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Verify OTP
</button>
          </>
        )}


        {/* STEP 3 */}
        {step === "newPassword" && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
           <button
  onClick={handleResetPassword}
  onMouseOver={(e)=> e.target.style.background = "#c4002b"}
  onMouseOut={(e)=> e.target.style.background = "#ff2e4d"}
  style={{
    width: "100%",
    padding: "10px",
    background: "#ff2e4d",
    border: "none",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Update Password
</button>
          </>
        )}


      </div>
    </div>
  )
}


export default ResetPassword
