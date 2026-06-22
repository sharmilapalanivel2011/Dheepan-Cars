const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
  phone: String,
  address: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"        // புதுசா register ஆகுறவங்க எல்லாரும் "user" ஆவாங்க
  }
})

module.exports = mongoose.model("User", userSchema)