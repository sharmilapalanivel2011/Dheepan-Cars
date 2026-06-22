const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
  image:         { type: String, required: true },
  description:   { type: String, default: "" },
  category:      { type: String, default: "General" },
  badge:         { type: String, default: null },
  stock:         { type: Number, default: 0 },
  rating:        { type: Number, default: 4.0 },
  scale:         { type: String, default: "N/A" },
  material:      { type: String, default: "N/A" },
  speed:         { type: String, default: "N/A" },
  battery:       { type: String, default: "N/A" },
  range:         { type: String, default: "N/A" },
  warranty:      { type: String, default: "N/A" },
  createdAt:     { type: Date,   default: Date.now }
})

module.exports = mongoose.model("Product", productSchema)