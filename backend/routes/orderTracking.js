


const express = require("express")
const router = express.Router()
const Order = require("../models/Order")

// GET - Order tracking info
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// PUT - Update tracking status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status, note } = req.body
    const order = await Order.findById(req.params.orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })

    order.trackingStatus = status
    order.statusHistory.push({ status, note: note || "", timestamp: new Date() })
    await order.save()

    res.json({ message: "Status updated", order })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router