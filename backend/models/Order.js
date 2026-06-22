const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  pincode: String,
  product: {
    name: String,
    price: Number,
    image: String,
  },
  items: [
    {
      name: String,
      price: Number,
      image: String,
      quantity: Number,
      
    }
  ],
  totalAmount: Number,
  orderId: String,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },


  // ✅ இந்த 2 fields add பண்ணு
  trackingStatus: {
    type: String,
    default: "Order Placed"
  },
  statusHistory: [
    {
      status: String,
      note: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});


module.exports = mongoose.model("Order", orderSchema);
