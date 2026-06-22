import { useEffect, useState } from "react"
import "../styles/Admin.css"

function Admin() {

  const [orders, setOrders] = useState([])

  // Add Product States
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
  }, [])

  // Step 7 — Image Upload to Cloudinary
  const handleUpload = async () => {
    if (!imageFile) return alert("Image select pannunga!")
    setUploading(true)

    const formData = new FormData()
    formData.append("image", imageFile)

    const res = await fetch("http://localhost:5000/upload-image", {
      method: "POST",
      body: formData
    })

    const data = await res.json()
    if (data.success) {
      setImageUrl(data.url)
      alert("✅ Image Uploaded!")
    } else {
      alert("❌ Upload Failed!")
    }
    setUploading(false)
  }

  // Step 8 — Product Save with Cloudinary URL
  const handleAddProduct = async () => {
    if (!imageUrl) return alert("First you need to upload the image!")

    const product = {
      name,
      price: Number(price),
      image: imageUrl,       // ✅ Cloudinary URL — MongoDB la save aagum
      description,
      category,
      stock: Number(stock)
    }

    const res = await fetch("http://localhost:5000/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })

    const data = await res.json()
    if (data.success) {
      setMessage("✅ Product Added!")
      // Reset all fields
      setName("")
      setPrice("")
      setDescription("")
      setCategory("")
      setStock("")
      setImageFile(null)
      setImageUrl("")
    } else {
      setMessage("❌ Failed!")
    }
  }

  // Delete Order
  const handleDeleteOrder = async (id) => {
    await fetch(`http://localhost:5000/order/${id}`, { method: "DELETE" })
    setOrders(orders.filter(o => o._id !== id))
  }

  return (
    <div className="admin-page">

      {/* ===== ADD PRODUCT SECTION ===== */}
      <h2>Add New Product</h2>

      <div className="add-product-form">

        <input
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          placeholder="Category (eg: Diecast, RC Car)"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <input
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={e => setStock(e.target.value)}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {/* Preview */}
        {imageUrl && (
          <div>
            <p>✅ Image Ready!</p>
            <img src={imageUrl} width="120" style={{ borderRadius: "8px" }} />
          </div>
        )}

        <button onClick={handleAddProduct}>Add Product</button>

        {message && <p>{message}</p>}

      </div>

      {/* ===== ORDERS SECTION ===== */}
      <h2>Orders</h2>

      <div className="orders-container">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>

            <img src={order.product.image} alt="" />
            <h3>{order.product.name}</h3>
            <p>Price: ₹{order.product.price}</p>
            <p><b>Order ID:</b> {order.orderId}</p>
            <p><b>Name:</b> {order.name}</p>
            <p><b>Phone:</b> {order.phone}</p>
            <p><b>Address:</b> {order.address}, {order.city} - {order.pincode}</p>
            <p className="date">{new Date(order.date).toLocaleString()}</p>

            <button onClick={() => handleDeleteOrder(order._id)}>
              Delete Order
            </button>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Admin