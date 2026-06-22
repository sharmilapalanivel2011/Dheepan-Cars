const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  likes: { type: [String], default: [] },    // array of emails who liked
  dislikes: { type: [String], default: [] }, // array of emails who disliked
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Review", reviewSchema)