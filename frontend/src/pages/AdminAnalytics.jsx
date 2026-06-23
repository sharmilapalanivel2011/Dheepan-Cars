import { API_URL } from "../config"

import { useEffect, useState } from "react"
import AdminSidebar from "../components/AdminSidebar"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"
import "./AdminAnalytics.css"

const COLORS = ["#e50914", "#ff6b6b", "#c0392b", "#ff4d4d", "#922b21", "#ff8080", "#641e16", "#ffb3b3"]

// ← NEW: keyword → category mapping (tune to your product names)
const CATEGORY_KEYWORDS = {
  "Die-cast": ["hot wheels", "matchbox", "die cast", "diecast", "die-cast", "metal car", "alloy"],
  "Model Kits":  ["model kit", "tamiya", "revell", "assembly", "kit", "build"],
  "Trucks & Buses": ["truck", "bus", "lorry", "transport", "hauler"],
  "Bikes": ["bike", "motorcycle", "moto", "harley", "ducati"],
  "Racing": ["formula", "f1", "racing", "nascar", "rally"],
  "Planes & Ships": ["plane", "aircraft", "ship", "boat", "helicopter", "fighter"],
}

// ← NEW: classify a product name into a category
function classifyProduct(name = "") {
  const lower = name.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat
  }
  return "Others"
}

function AdminAnalytics() {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [revenueType, setRevenueType] = useState("monthly")
  const [chartStyle, setChartStyle]   = useState("bar")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [orders, setOrders]       = useState([])

  useEffect(() => { loadData() }, [])

  

const loadData = async () => {
  setLoading(true)

  try {
    const res = await fetch(`${API_URL}/admin/analytics`)
    const json = await res.json()

    if (json.success) {
      setData(json)
    } else {
      fallbackLoad()
    }
  } catch {
    fallbackLoad()
  }

  setLoading(false)
}

  const fallbackLoad = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`)
      const ordersData = await res.json()
      setOrders(ordersData)
      setData(computeFromOrders(ordersData))
    } catch {
      console.error("Could not load analytics")
    }
  }

  const computeFromOrders = (orderList) => {
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const now    = new Date()

    // Monthly revenue
    const mMap = {}
    MONTHS.forEach(m => (mMap[m] = 0))
    orderList.forEach(o => {
      const d = new Date(o.date)
      if (d.getFullYear() === now.getFullYear())
        mMap[MONTHS[d.getMonth()]] += Number(o.totalAmount || o.product?.price || 0)
    })
    const monthlyRevenue = MONTHS.map(month => ({ month, revenue: mMap[month] }))

    // Weekly revenue
    const wMap = { "Week 1": 0, "Week 2": 0, "Week 3": 0, "Week 4": 0, "Week 5": 0 }
    orderList.forEach(o => {
      const d = new Date(o.date)
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        const wk = `Week ${Math.ceil(d.getDate() / 7)}`
        if (wMap[wk] !== undefined)
          wMap[wk] += Number(o.totalAmount || o.product?.price || 0)
      }
    })
    const weeklyRevenue = Object.entries(wMap).map(([week, revenue]) => ({ week, revenue }))

    // Top products
    const pMap = {}
    orderList.forEach(o => {
      if (o.items?.length > 0) {
        o.items.forEach(item => {
          if (!pMap[item.name])
            pMap[item.name] = { name: item.name, image: item.image, totalSold: 0, totalRevenue: 0 }
          pMap[item.name].totalSold    += item.quantity || 1
          pMap[item.name].totalRevenue += (item.price || 0) * (item.quantity || 1)
        })
      } else if (o.product?.name) {
        const k = o.product.name
        if (!pMap[k])
          pMap[k] = { name: k, image: o.product.image, totalSold: 0, totalRevenue: 0 }
        pMap[k].totalSold    += 1
        pMap[k].totalRevenue += o.product.price || 0
      }
    })
    const topProducts = Object.values(pMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 8)

    // ← NEW: category mix — group revenue by category
    const catMap = {}
    orderList.forEach(o => {
      const items = o.items?.length > 0
        ? o.items.map(i => ({ name: i.name, revenue: (i.price || 0) * (i.quantity || 1) }))
        : o.product?.name
          ? [{ name: o.product.name, revenue: Number(o.product.price || 0) }]
          : []

      items.forEach(({ name, revenue }) => {
        const cat = classifyProduct(name)
        catMap[cat] = (catMap[cat] || 0) + revenue
      })
    })

    const categoryMix = Object.entries(catMap)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)

    return {
      monthlyRevenue,
      weeklyRevenue,
      topProducts,
      categoryMix,                          // ← NEW
      totalOrders:   orderList.length,
      totalRevenue:  orderList.reduce(
        (s, o) => s + Number(o.totalAmount || o.product?.price || 0), 0
      ),
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content analytics-loading">
          <div className="loading-spinner" />
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const revData = revenueType === "monthly" ? data.monthlyRevenue : data.weeklyRevenue
  const revKey  = revenueType === "monthly" ? "month" : "week"

  const totalRevenue = data.totalRevenue || 0
  const peakObj  = revData?.reduce((a, b) => (b.revenue > a.revenue ? b : a), revData?.[0] || {})
  const nonZero  = revData?.filter(d => d.revenue > 0) || []
  const avgRevenue = nonZero.length ? Math.round(totalRevenue / nonZero.length) : 0

  // ← NEW: total for percentage calculation
  const catTotal = (data.categoryMix || []).reduce((s, c) => s + c.value, 0)

  // ← NEW: custom tooltip for the donut
  const DonutTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { name, value } = payload[0].payload
    const pct = catTotal > 0 ? ((value / catTotal) * 100).toFixed(1) : 0
    return (
      <div style={{
        background: "#111",
        border: "1px solid #e50914",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        color: "#fff",
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{name}</p>
        <p style={{ margin: "4px 0 0", color: "#ff6b6b" }}>
          ₹{value.toLocaleString()} &nbsp;·&nbsp; {pct}%
        </p>
      </div>
    )
  }

  // ← NEW: custom label inside each slice
  const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null          // hide tiny slice labels
    const RAD    = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55
    const x      = cx + radius * Math.cos(-midAngle * RAD)
    const y      = cy + radius * Math.sin(-midAngle * RAD)
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight={600}>
        {(percent * 100).toFixed(0)}%
      </text>
    )
  }

  const RevenueChart = () => {
    if (chartStyle === "bar") return (
      <BarChart data={revData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
        <XAxis dataKey={revKey} stroke="#555" tick={{ fontSize: 11 }} />
        <YAxis stroke="#555" tick={{ fontSize: 11 }}
          tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
        <Tooltip contentStyle={{ background: "#111", border: "1px solid #e50914", borderRadius: 8 }}
          labelStyle={{ color: "#fff" }}
          formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="revenue" fill="#e50914" radius={[4, 4, 0, 0]} />
      </BarChart>
    )
    if (chartStyle === "area") return (
      <AreaChart data={revData}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#e50914" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#e50914" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
        <XAxis dataKey={revKey} stroke="#555" tick={{ fontSize: 11 }} />
        <YAxis stroke="#555" tick={{ fontSize: 11 }}
          tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
        <Tooltip contentStyle={{ background: "#111", border: "1px solid #e50914", borderRadius: 8 }}
          labelStyle={{ color: "#fff" }}
          formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
        <Area type="monotone" dataKey="revenue" stroke="#e50914"
          fill="url(#areaGrad)" strokeWidth={2.5} />
      </AreaChart>
    )
    return (
      <LineChart data={revData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
        <XAxis dataKey={revKey} stroke="#555" tick={{ fontSize: 11 }} />
        <YAxis stroke="#555" tick={{ fontSize: 11 }}
          tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
        <Tooltip contentStyle={{ background: "#111", border: "1px solid #e50914", borderRadius: 8 }}
          labelStyle={{ color: "#fff" }}
          formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
        <Line type="monotone" dataKey="revenue" stroke="#e50914" strokeWidth={2.5}
          dot={{ fill: "#e50914", r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">

        {/* Header */}
        <div className="analytics-header">
          <div>
            <h1>📊 Analytics</h1>
            <p className="analytics-subtitle">Sales performance & revenue insights</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">💰</div>
            <div>
              <p className="kpi-label">Total Revenue</p>
              <h2 className="kpi-value">₹{totalRevenue.toLocaleString()}</h2>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">📦</div>
            <div>
              <p className="kpi-label">Total Orders</p>
              <h2 className="kpi-value">{data.totalOrders}</h2>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">📈</div>
            <div>
              <p className="kpi-label">Peak Month</p>
              <h2 className="kpi-value">{peakObj?.[revKey] || "—"}</h2>
              <p className="kpi-sub">₹{(peakObj?.revenue || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">📉</div>
            <div>
              <p className="kpi-label">Avg Revenue</p>
              <h2 className="kpi-value">₹{avgRevenue.toLocaleString()}</h2>
              <p className="kpi-sub">per active period</p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="analytics-section">
          <div className="analytics-section-header">
            <h3>💹 Revenue Trend</h3>
            <div className="chart-controls-row">
              <div className="toggle-group">
                <button className={`toggle-btn ${revenueType === "monthly" ? "active" : ""}`}
                  onClick={() => setRevenueType("monthly")}>Monthly</button>
                <button className={`toggle-btn ${revenueType === "weekly" ? "active" : ""}`}
                  onClick={() => setRevenueType("weekly")}>Weekly</button>
              </div>
              <div className="toggle-group">
                {["bar", "line", "area"].map(s => (
                  <button key={s}
                    className={`toggle-btn ${chartStyle === s ? "active" : ""}`}
                    onClick={() => setChartStyle(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RevenueChart />
          </ResponsiveContainer>
        </div>

        {/* Bottom Grid */}
        <div className="analytics-bottom-grid">

          {/* Top Selling Products — unchanged */}
          <div className="analytics-section">
            <h3>🏆 Top Selling Products</h3>
            {(!data.topProducts || data.topProducts.length === 0) ? (
              <p className="no-data-msg">No sales data yet</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.topProducts.slice(0, 6)} layout="vertical"
                    margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
                    <XAxis type="number" stroke="#555" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" stroke="#555" tick={{ fontSize: 11 }}
                      width={110} tickFormatter={v => v.length > 14 ? v.slice(0, 14) + "…" : v} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #e50914", borderRadius: 8 }}
                      labelStyle={{ color: "#fff" }} formatter={v => [v, "Units Sold"]} />
                    <Bar dataKey="totalSold" fill="#e50914" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="top-products-list">
                  {data.topProducts.slice(0, 5).map((p, i) => (
                    <div className="top-product-row" key={i}>
                      <span className={`rank-badge rank-${i + 1}`}>#{i + 1}</span>
                      <img src={p.image} alt={p.name} className="tp-thumb"
                        onError={e => { e.target.src = "https://via.placeholder.com/36" }} />
                      <div className="tp-info">
                        <p className="tp-name">{p.name}</p>
                        <p className="tp-revenue">₹{p.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="tp-sold">
                        <span>{p.totalSold}</span>
                        <small>sold</small>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

         

        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics

