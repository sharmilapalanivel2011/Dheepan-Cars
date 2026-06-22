const Order = require("../models/Order");

const VALID_STATUSES = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];


const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow only the order owner or an admin to view tracking
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorised" });
    }

    const trackingData = {
      orderId: order._id,
      currentStatus: order.trackingStatus || "Order Placed",
      statusHistory: order.statusHistory || [],
      product: order.orderItems,
      createdAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery || null,
    };

    res.json(trackingData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Push to history log
    const historyEntry = {
      status,
      timestamp: new Date(),
      note: note || "",
    };

    order.trackingStatus = status;
    order.statusHistory = order.statusHistory
      ? [...order.statusHistory, historyEntry]
      : [historyEntry];

    // Mark as delivered if applicable
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.json({
      message: "Status updated successfully",
      orderId: updatedOrder._id,
      currentStatus: updatedOrder.trackingStatus,
      statusHistory: updatedOrder.statusHistory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Get all orders with tracking info (Admin dashboard)
// @route GET /api/order-tracking/admin/all
// @access Private/Admin
const getAllOrdersTracking = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .select("_id trackingStatus createdAt user orderItems")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getOrderTracking,
  updateOrderStatus,
  getAllOrdersTracking,
};



