require('dotenv').config();
const connectDB = require('./config/db');
const Review = require("./models/Review")
connectDB(); // Top la call pannu
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const Order = require("./models/Order")
const Product = require("./models/Product")
const orderTrackingRoutes = require("./routes/orderTracking");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client("994440570924-qfkq59gmr1b17g4p5lojrvo2l6qbqs0m.apps.googleusercontent.com")
const User = require("./models/User")
const { cloudinary, upload } = require("./cloudinary")








const app = express()


// middleware
app.use(cors())
app.use(express.json())
app.use("/order-tracking", orderTrackingRoutes)






// Image Upload Route
app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    // Buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64")
    const dataURI = `data:${req.file.mimetype};base64,${b64}`


    // Cloudinary ku upload
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "dheepan-cars"
    })


    res.json({ success: true, url: result.secure_url })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
})






// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dheepancarsproject@gmail.com",
    pass: "ohufqsgzmwwtqtyu"
  }
})




// ================== ROUTES ================== //






// test route
app.get("/", (req, res) => {
  res.send("API is running...")
})




app.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.json([])
  }
})


app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch (err) {
    res.json(null)
  }
})




app.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false })
  }
})


app.delete("/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false })
  }
})


app.post("/place-order", async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      trackingStatus: "Order Placed",
      date: new Date()
    });
    await order.save();

    // ✅ Stock Decrement
    const { product, items } = req.body;

    if (items && items.length > 0) {
      // Cart checkout — multiple items
      for (const item of items) {
        if (item._id) {
          await Product.findByIdAndUpdate(
            item._id,
            { $inc: { stock: -(item.quantity || 1) } }
          );
        }
      }
    } else if (product && product._id) {
      // Single product (Buy Now)
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -1 } }
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});




// ✅ Get Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 })
    res.json(orders)
  } catch (err) {
    res.json([])
  }
})




// ✅ Delete Order
app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false })
  }
})


app.post("/login", async (req, res) => {


  const { email, password } = req.body


  const user = await User.findOne({ email })


  if (!user) {
    return res.json({ success: false, message: "User not found" })
  }


  if (!user.isVerified) {
    return res.json({ success: false, message: "Verify OTP first" })
  }


  if (user.password !== password) {
    return res.json({ success: false, message: "Wrong password" })
  }


  res.json({ success: true, user })
})


// ✅ Admin Login
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.json({ success: true, role: "admin" })
  } else {
    res.json({ success: false, message: "Invalid admin credentials" })
  }
})


// ✅ Get orders by user email (for user order tracking)
app.get("/my-orders/:email", async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ date: -1 })
    res.json(orders)
  } catch (err) {
    res.json([])
  }
})






app.post("/google-login", async (req, res) => {


  const { token } = req.body


  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "994440570924-qfkq59gmr1b17g4p5lojrvo2l6qbqs0m.apps.googleusercontent.com"
  })


  const payload = ticket.getPayload()


  const email = payload.email


  let user = await User.findOne({ email })


  if (!user) {
    // first time user
    user = new User({ email, isVerified: false })
    await user.save()


    return res.json({ newUser: true, email })
  }


  if (!user.isVerified) {
    return res.json({ newUser: true, email })
  }


  // ✅ already verified → direct login
return res.json({ newUser: false, user })
})




app.post("/verify-otp", async (req, res) => {


  const { email, otp } = req.body


  const user = await User.findOne({ email })


  if (!user) return res.json({ success: false })


  if (user.otp == otp) {


    user.isVerified = true
    user.otp = null


    await user.save()


    return res.json({ success: true, user })
  }


  res.json({ success: false })
})


// new register
app.post("/register", async (req, res) => {


  const { username, email, password } = req.body


  let user = await User.findOne({ email })


  if (user) {
    return res.json({ success: false, message: "User already exists" })
  }


  const otp = Math.floor(100000 + Math.random() * 900000)


  user = new User({
    username,
    email,
    password,
    otp,
    isVerified: false
  })


  await user.save()


  await transporter.sendMail({
    from: "dheepancarsproject@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`
  })


  res.json({ success: true })
})


// forget password
app.post("/send-otp", async (req, res) => {


  const { email } = req.body


  const user = await User.findOne({ email })


  if (!user) return res.json({ success: false })


  const otp = Math.floor(100000 + Math.random() * 900000)


  user.otp = otp
  await user.save()


  await transporter.sendMail({
    from: "dheepancarsproject@gmail.com",
    to: email,
    subject: "Reset Password OTP",
    text: `Your OTP is ${otp}`
  })


  res.json({ success: true })
})




// reset password
app.post("/reset-password", async (req, res) => {


  const { email, password } = req.body


  const user = await User.findOne({ email })


  user.password = password
  user.otp = null


  await user.save()


  res.json({ success: true, user })
})






// ✅ Send Email — handles both Buy Now (product) and Cart (items) orders
app.post("/send-order-email", async (req, res) => {
  const { name, email, phone, address, city, pincode, product, items, totalAmount, orderId } = req.body


  // ── Determine order type ──
  const isCartOrder = items && items.length > 0


  // ── Build product HTML block used in both emails ──
  const productHTML = isCartOrder
    ? `
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        ${items.map(item => `
          <tr>
            <td style="padding:8px;vertical-align:top;">
              <img src="${item.image || ""}" width="80" style="border-radius:8px;display:block;"/>
            </td>
            <td style="padding:8px;vertical-align:top;">
              <p style="margin:0 0 4px;font-weight:bold;">${item.name}</p>
              <p style="margin:0 0 2px;">Qty: ${item.quantity} × ₹${Number(item.price).toLocaleString("en-IN")}</p>
              <p style="margin:0;">Subtotal: ₹${(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </td>
          </tr>
        `).join("")}
      </table>
      <p style="font-size:16px;"><b>Order Total: ₹${Number(totalAmount).toLocaleString("en-IN")}</b></p>
    `
    : `
      <img src="${product?.image || ""}" width="120" style="border-radius:8px;display:block;margin-bottom:8px;"/>
      <p>${product?.name}</p>
      <p>Price: ₹${product?.price}</p>
    `


  try {


    // CUSTOMER EMAIL
    await transporter.sendMail({
      from: "dheepancarsproject@gmail.com",
      to: email,
      subject: "Order Confirmation - Dheepan Cars",
      html: `
      <h2>Order Confirmed 🎉</h2>
      <p><b>Order ID:</b> ${orderId}</p>


      <h3>Product</h3>
      ${productHTML}


      <p>Delivery Address:</p>
      <p>${address}, ${city} - ${pincode}</p>


      <p>Thank you for shopping ❤️</p>
      `
    })


    // ADMIN EMAIL
    await transporter.sendMail({
      from: "dheepancarsproject@gmail.com",
      to: "dheepancarsproject@gmail.com",
      subject: "🛒 New Order Received",
      html: `
      <h2>New Order 🚀</h2>


      <p><b>Order ID:</b> ${orderId}</p>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>


      <h3>Product</h3>
      ${productHTML}


      <p><b>Address:</b></p>
      <p>${address}, ${city} - ${pincode}</p>
      `
    })


    console.log("✅ Both emails sent")
    res.json({ success: true })


  } catch (error) {
    console.log("❌ Email error:", error)
    res.json({ success: false })
  }
})




// ✅ Get user profile
app.get("/user-profile/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (!user) return res.json({ success: false, message: "User not found" })
    res.json({ success: true, user })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})


// ✅ Update profile (name, phone)
app.put("/update-profile", async (req, res) => {
  try {
    const { email, username, phone } = req.body
    const user = await User.findOneAndUpdate(
      { email },
      { username, phone },
     { returnDocument: "after" }
    )
    res.json({ success: true, user })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})


// ✅ Save address
app.put("/save-address", async (req, res) => {
  try {
    const { email, address } = req.body
    const user = await User.findOneAndUpdate(
      { email },
      { address },
       {returnDocument: "after" } 
    )
    res.json({ success: true, user })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})


// ✅ Change password
app.put("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.json({ success: false, message: "User not found" })
    if (user.password !== currentPassword) return res.json({ success: false, message: "Current password wrong" })
    user.password = newPassword
    await user.save()
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})




app.put("/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;


    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: status.toLowerCase(),     // existing field
        trackingStatus: status,           // ← இது add பண்ணு
        $push: {
          statusHistory: {
            status: status,
            note: `Status updated to ${status}`,
            timestamp: new Date()
          }
        }
      },
      { returnDocument: "after" }
    );


    if (!order) return res.json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


// ============================================
// REVIEW ROUTES — paste these into server.js
// Also add at top: const Review = require("./models/Review")
// ============================================


// ✅ Get all reviews for a product
app.get("/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ date: -1 })
    res.json(reviews)
  } catch (err) {
    res.json([])
  }
})


// ✅ Post a new review
app.post("/reviews", async (req, res) => {
  try {
    const { productId, username, email, rating, comment } = req.body


    // One review per user per product
    const existing = await Review.findOne({ productId, email })
    if (existing) {
      return res.json({ success: false, message: "You already reviewed this product" })
    }


    const review = new Review({ productId, username, email, rating, comment })
    await review.save()
    res.json({ success: true, review })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})


// ✅ Like a review
app.put("/reviews/:id/like", async (req, res) => {
  try {
    const { email } = req.body
    const review = await Review.findById(req.params.id)


    if (review.likes.includes(email)) {
      // Unlike
      review.likes = review.likes.filter(e => e !== email)
    } else {
      review.likes.push(email)
      review.dislikes = review.dislikes.filter(e => e !== email) // remove dislike if exists
    }


    await review.save()
    res.json({ success: true, review })
  } catch (err) {
    res.json({ success: false })
  }
})


// ✅ Dislike a review
app.put("/reviews/:id/dislike", async (req, res) => {
  try {
    const { email } = req.body
    const review = await Review.findById(req.params.id)


    if (review.dislikes.includes(email)) {
      // Un-dislike
      review.dislikes = review.dislikes.filter(e => e !== email)
    } else {
      review.dislikes.push(email)
      review.likes = review.likes.filter(e => e !== email) // remove like if exists
    }


    await review.save()
    res.json({ success: true, review })
  } catch (err) {
    res.json({ success: false })
  }
})


// ✅ Delete own review
app.delete("/reviews/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false })
  }
})


// Get review counts for all products at once
app.get("/review-counts", async (req, res) => {
  try {
    const counts = await Review.aggregate([
      { $group: { _id: "$productId", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
    ])
    res.json(counts)
  } catch (err) {
    res.json([])
  }
})




// ✅ Customer Support Email Route
// Add this to your server.js (paste after your existing routes)


app.post("/customer-support", async (req, res) => {
  try {
    const { name, email, phone, issueType, productName, productId, orderId, message } = req.body


    if (!name || !email || !issueType || !message) {
      return res.json({ success: false, message: "Required fields missing." })
    }


    // ── Email to Admin ──
    await transporter.sendMail({
      from: "dheepancarsproject@gmail.com",
      to: "dheepancarsproject@gmail.com",
      subject: `🎧 New Support Request – ${issueType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background: #111; color: #fff; padding: 30px; border-radius: 12px;">
          <h2 style="color: #e50914; margin-bottom: 20px;">📩 New Customer Support Request</h2>


          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #aaa; width: 140px;">Name</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #aaa;">Email</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #aaa;">Phone</td>
              <td style="padding: 8px 0;">${phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #aaa;">Issue Type</td>
              <td style="padding: 8px 0; color: #e50914; font-weight: bold;">${issueType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #aaa;">Product</td>
              <td style="padding: 8px 0;">${productName || "—"} ${productId ? `(ID: ${productId})` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #aaa;">Order ID</td>
              <td style="padding: 8px 0;">${orderId || "—"}</td>
            </tr>
          </table>


          <div style="margin-top: 20px; background: #1a1a1a; border-left: 4px solid #e50914; padding: 16px; border-radius: 8px;">
            <p style="color: #aaa; font-size: 13px; margin-bottom: 8px;">Message:</p>
            <p style="color: #fff; line-height: 1.6;">${message}</p>
          </div>


          <p style="margin-top: 20px; color: #555; font-size: 12px;">Sent from Dheepan Cars Customer Support Form</p>
        </div>
      `
    })


    // ── Confirmation Email to User ──
    await transporter.sendMail({
      from: "dheepancarsproject@gmail.com",
      to: email,
      subject: "✅ We received your support request – Dheepan Cars",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background: #111; color: #fff; padding: 30px; border-radius: 12px;">
          <h2 style="color: #e50914;">Hi ${name} 👋</h2>
          <p style="color: #ccc; margin: 16px 0; line-height: 1.7;">
            Thank you for reaching out to <strong style="color:#fff;">Dheepan Cars</strong> support!
            We've received your query regarding <strong style="color:#e50914;">${issueType}</strong>
            and our team will get back to you within <strong style="color:#fff;">24–48 hours</strong>.
          </p>


          <div style="background: #1a1a1a; border-radius: 10px; padding: 16px; margin: 20px 0;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">YOUR MESSAGE</p>
            <p style="color: #ccc; line-height: 1.6;">${message}</p>
          </div>


          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            Please note: We follow a <span style="color:#e50914;">no-returns policy</span>.
            For damaged or incorrect items, our team will review your case individually.
          </p>


          <p style="margin-top: 24px; color: #555; font-size: 12px;">
            – Dheepan Cars Support Team<br/>
            dheepancarsproject@gmail.com
          </p>
        </div>
      `
    })


    console.log("✅ Support emails sent for:", email)
    res.json({ success: true })


  } catch (error) {
    console.log("❌ Support email error:", error)
    res.json({ success: false, message: "Email send failed." })
  }
})

// =============================================
// ADD THIS TO YOUR server.js
// =============================================



// PUT update stock for a product
app.put("/admin/stock/:id", async (req, res) => {
  try {
    const { stock } = req.body
    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0)
      return res.status(400).json({ success: false, message: "Invalid stock value" })
 
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock) },
      {returnDocument: "after" }
    )
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" })
 
    res.json({ success: true, product })
  } catch (err) {
    console.error("Stock update error:", err)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// DELETE a product
// ✅ ROUTE 3: Delete product from stock page
app.delete("/admin/product/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted)
      return res.status(404).json({ success: false, message: "Product not found" })
    res.json({ success: true, message: "Product deleted" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// ── Analytics Routes ──
// GET analytics data (top selling products + revenue breakdown)
app.get("/admin/analytics", async (req, res) => {
  try {
    const Order = require("./models/Order")
    const orders = await Order.find({})

    // ── Top Selling Products ──
    const productSalesMap = {}

    orders.forEach(order => {
      // Multi-item orders (cart checkout)
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const key = item.name
          if (!productSalesMap[key]) {
            productSalesMap[key] = { name: item.name, image: item.image, totalSold: 0, totalRevenue: 0 }
          }
          productSalesMap[key].totalSold += item.quantity || 1
          productSalesMap[key].totalRevenue += (item.price || 0) * (item.quantity || 1)
        })
      } else if (order.product && order.product.name) {
        // Single product orders
        const key = order.product.name
        if (!productSalesMap[key]) {
          productSalesMap[key] = { name: order.product.name, image: order.product.image, totalSold: 0, totalRevenue: 0 }
        }
        productSalesMap[key].totalSold += 1
        productSalesMap[key].totalRevenue += order.product.price || 0
      }
    })

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 8)

    // ── Monthly Revenue (last 12 months) ──
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const monthlyMap = {}
    MONTHS.forEach(m => monthlyMap[m] = 0)

    const now = new Date()
    const currentYear = now.getFullYear()

    orders.forEach(order => {
      const d = new Date(order.date)
      if (d.getFullYear() === currentYear) {
        const revenue = order.totalAmount || order.product?.price || 0
        monthlyMap[MONTHS[d.getMonth()]] += Number(revenue)
      }
    })

    const monthlyRevenue = MONTHS.map(month => ({ month, revenue: monthlyMap[month] }))

    // ── Weekly Revenue (current month) ──
    const weeklyMap = { "Week 1": 0, "Week 2": 0, "Week 3": 0, "Week 4": 0, "Week 5": 0 }
    orders.forEach(order => {
      const d = new Date(order.date)
      if (d.getFullYear() === currentYear && d.getMonth() === now.getMonth()) {
        const wk = `Week ${Math.ceil(d.getDate() / 7)}`
        if (weeklyMap[wk] !== undefined) {
          weeklyMap[wk] += Number(order.totalAmount || order.product?.price || 0)
        }
      }
    })
    const weeklyRevenue = Object.entries(weeklyMap).map(([week, revenue]) => ({ week, revenue }))

    // ── Category Breakdown ──
    const categoryMap = {}
    orders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const cat = item.category || "Others"
          categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity || 1)
        })
      }
    })
    const categoryData = Object.entries(categoryMap).map(([category, count]) => ({ category, count }))

    res.json({
      success: true,
      topProducts,
      monthlyRevenue,
      weeklyRevenue,
      categoryData,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || o.product?.price || 0), 0)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// ── Stock Update Route (inlined — no new file needed) ──
app.put("/admin/stock/:id", async (req, res) => {
  try {
    const Product = require("./models/Product")   // un path correct aa irukka check pannu
    const { stock } = req.body
 
    if (stock === undefined || isNaN(stock) || Number(stock) < 0)
      return res.status(400).json({ success: false, message: "Invalid stock value" })
 
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock) },
      {returnDocument: "after" }
    )
 
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" })
 
    res.json({ success: true, product })
  } catch (err) {
    console.error("Stock update error:", err)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


// Existing products la stock undefined → 0 set pannu (one-time use)
app.get("/admin/fix-stock", async (req, res) => {
  try {
    const result = await Product.updateMany(
      { stock: { $exists: false } },
      { $set: { stock: 0 } }
    )
    // Also fix null values
    const result2 = await Product.updateMany(
      { stock: null },
      { $set: { stock: 0 } }
    )
    res.json({ 
      success: true, 
      fixed: result.modifiedCount + result2.modifiedCount 
    })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
})

// One-time: static products DB la import pannu
app.post("/admin/migrate-static", async (req, res) => {
  try {
    const { products } = req.body
    let added = 0, skipped = 0

    for (const p of products) {
      const existing = await Product.findOne({
        name: { $regex: new RegExp(`^${p.name.trim()}$`, "i") }
      })
      if (existing) { skipped++; continue }

      await Product.create({
        name:          p.name,
        price:         p.price,
        originalPrice: p.originalPrice || Math.round(p.price * 1.3),
        description:   p.desc || "",
        category:      p.category || "General",
        badge:         p.badge || null,
        stock:         0,
        image:         p.image
      })
      added++
    }

    res.json({ success: true, added, skipped })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
})



// server start
app.listen(5000, () => console.log("Server running on port 5000"))
